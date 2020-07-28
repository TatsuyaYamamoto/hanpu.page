import { firestore } from "firebase-admin";
import { Logger, LogLevel } from "@firebase/logger";

import moment from "moment-timezone";

import { ProductDocument } from "../../domains/Product";
import { AuditLogDocument, LogType } from "../../domains/AuditLog";
import {
  AnalyticsDocument,
  AnalyticsType,
  CollectionPath as AnalyticsCollectionPath,
  SimpleActivateCountAnalyticsDocument
} from "../../domains/Analytics";
import CollectionReference = firestore.CollectionReference;
import FieldValue = firestore.FieldValue;

interface NewAnalyticsDatum {
  ownerUid: string;
  productId: string;
  activateCount: number;
}

const logger = new Logger("create-activity-analytics");
logger.logLevel = LogLevel.DEBUG;

// prettier-ignore
const auditLogColRef = firestore().collection(`auditLogs`) as CollectionReference<AuditLogDocument>;
// prettier-ignore
const analyticsColRef = firestore().collection(AnalyticsCollectionPath) as CollectionReference<AnalyticsDocument>;
// prettier-ignore
const productColRef = firestore().collection(`products`) as CollectionReference<ProductDocument>;

/**
 * @private
 *
 * @param datum
 * @param formattedTargetDate
 */
const upsertSimpleActivateCountAnalytics = async (
  datum: NewAnalyticsDatum,
  formattedTargetDate: string
) => {
  const analyticsSnap = await analyticsColRef
    .where("type", "==", AnalyticsType.SIMPLE_ACTIVATE_COUNT)
    .where("ownerUid", "==", datum.ownerUid)
    .where("productId", "==", datum.productId)
    .get();

  if (analyticsSnap.empty) {
    const newDoc: SimpleActivateCountAnalyticsDocument = {
      type: AnalyticsType.SIMPLE_ACTIVATE_COUNT,
      data: {
        total: datum.activateCount,
        timeline: {
          [formattedTargetDate]: datum.activateCount
        }
      },
      ownerUid: datum.ownerUid,
      productId: datum.productId,
      updatedAt: FieldValue.serverTimestamp()
    };
    const result = await analyticsColRef.add(newDoc);

    logger.log(
      `target date analytics data is not found. new doc is created. id: ${result.id}, count: ${datum.activateCount}, date:${formattedTargetDate}`
    );
  } else {
    const doc = analyticsSnap.docs[0];
    const { data } = doc.data();
    const prevTargetDateCount = data.timeline[formattedTargetDate];
    if (prevTargetDateCount) {
      logger.log(
        `prev target date analytics data is found. overwrite it. prev:${prevTargetDateCount}, new: ${datum.activateCount}, date:${formattedTargetDate}`
      );
    }

    const timeline = {
      ...data.timeline,
      [formattedTargetDate]: datum.activateCount
    };
    const total = Object.keys(timeline)
      .map(date => timeline[date])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    await doc.ref.update({
      [`data.total`]: total,
      [`data.timeline`]: timeline
    });

    logger.log(
      `target date analytics date is inserted. count: ${datum.activateCount}, total: ${total}`
    );
  }
};

const createActivatesAnalyticsData = async (
  activateLogs: AuditLogDocument[]
) => {
  const newAnalyticsData: {
    [ownerUidProductId: string]: NewAnalyticsDatum;
  } = {};

  for (const activateLog of activateLogs) {
    const {
      params: { productId }
    } = activateLog;

    const productDocRef = productColRef.doc(productId);
    const productSnap = await productDocRef.get();
    const { ownerUid } = productSnap.data() ?? {};

    const key = `${ownerUid}${productId}`;

    if (!ownerUid) {
      continue; // unexpected.
    }

    if (newAnalyticsData[key]) {
      newAnalyticsData[key].activateCount += 1;
    } else {
      newAnalyticsData[key] = {
        ownerUid,
        productId,
        activateCount: 1
      };
    }
  }
  return newAnalyticsData;
};

/**
 * {@link AnalyticsType.SIMPLE_ACTIVATE_COUNT}のanalytics dataを作成する。
 * 基準日(引数のDate、または new Date())の00:00-23:59が対象の範囲
 *
 * @param date
 */
export const createSimpleActivateCountAnalytics = async (
  date: Date = new Date()
) => {
  const providedDate = moment(date).tz("Asia/Tokyo");
  logger.log(`provided date: ${providedDate}`);

  const range = {
    from: providedDate.clone().startOf("day"),
    to: providedDate.clone().endOf("day")
  };
  logger.log(`target date range: ${range}`);

  const formattedTargetDate = range.from.format("YYYY-MM-DD");
  logger.log(`formatted target date: ${formattedTargetDate}`);

  const targetAuditLogSnap = await auditLogColRef
    .where("type", "==", LogType.ACTIVATE_WITH_DOWNLOAD_CODE)
    .where("ok", "==", true)
    .where("createdAt", ">=", range.from.toDate())
    .where("createdAt", "<", range.to.toDate())
    .get();
  logger.log(`target audit log count: ${targetAuditLogSnap.size}`);

  const newAnalyticsData = await createActivatesAnalyticsData(
    targetAuditLogSnap.docs.map(doc => doc.data())
  );
  logger.log(`new analytics data`, newAnalyticsData);

  await Promise.all(
    Object.keys(newAnalyticsData).map(key => {
      const datum = newAnalyticsData[key];
      return upsertSimpleActivateCountAnalytics(datum, formattedTargetDate);
    })
  );
};
