#!/usr/bin/env node

/**
 * @fileOverview
 *
 *
 * https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_data_with_the_firebase_cli
 *
 * firebase firestore:delete analytics --recursive --project dl-code-dev
 */

// tslint:disable:no-logger
import * as fs from "fs";

import moment from "moment-timezone";
import firebaseAdmin from "firebase-admin";
import { Logger, LogLevel } from "@firebase/logger";
import CollectionReference = firebaseAdmin.firestore.CollectionReference;
import Timestamp = firebaseAdmin.firestore.Timestamp;

const app = firebaseAdmin.initializeApp();
const logger = new Logger("reset-analytics-data");
logger.logLevel = LogLevel.DEBUG;

logger.log(`== firebase admin sdk =========`);
logger.log(`firebase app name: ${app.name}`);
logger.log(`project id       : ${app.options.projectId}`);
logger.log(`databaseURL      : ${app.options.databaseURL}`);
logger.log(`================================`);

const credentials: any = fs.readFileSync(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
  { encoding: "utf-8" }
);
logger.log(`== firebase admin sdk =========`);
logger.log(`project id       : ${credentials.project_id}`);
logger.log(`================================`);

import { createSimpleActivateCountAnalytics } from "../functions/service/createActivatesAnalytics";
import { AuditLogDocument, LogType } from "../domains/AuditLog";
import { AnalyticsDocument } from "../domains/Analytics";

(async () => {
  const firestore = app.firestore();
  // prettier-ignore
  const auditLogColRef = firestore.collection(`auditLogs`) as CollectionReference<AuditLogDocument>;
  // prettier-ignore
  const analyticsColRef = firestore.collection(`analytics`) as CollectionReference<AnalyticsDocument>;

  const allAnalytics = await analyticsColRef.get();
  if (allAnalytics.size !== 0) {
    logger.error("there are any docs in the collection at analytics.");
    process.exit(-1);
    return;
  }

  const targetAuditLogSnap = await auditLogColRef
    .where("type", "==", LogType.ACTIVATE_WITH_DOWNLOAD_CODE)
    .where("ok", "==", true)
    .get();

  const dateList = targetAuditLogSnap.docs
    .map(doc => doc.data())
    .map(data => (data.createdAt as Timestamp).toDate())
    .map(date => moment(date).tz("Asia/Tokyo"));

  const range = {
    from: moment.min(dateList),
    to: moment() // today
  };
  logger.log(`target date range: ${range}`);

  for (
    const date = range.from.clone();
    date.diff(range.to, "days") <= 0;
    date.add(1, "days")
  ) {
    logger.log(`== ${date.format("YYYY-MM-DD")} ===============`);
    logger.log(
      `start to create analytics data at ${date.format("YYYY-MM-DD")}`
    );
    await createSimpleActivateCountAnalytics(date.toDate());
    logger.log("success!");
  }
})().catch(e => {
  logger.error(e);
});
