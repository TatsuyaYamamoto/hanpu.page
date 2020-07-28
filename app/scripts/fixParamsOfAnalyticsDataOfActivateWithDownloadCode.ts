#!/usr/bin/env node

/**
 * @fileOverview
 * `type === ACTIVATE_WITH_DOWNLOAD_CODE` のauditLogにparams.productId を追加する修正のためのスクリプト
 *
 * 背景
 * develop-analyticsをリリースするためのマイグレーションスクリプト。
 * analytics data(type === LogType.ACTIVATE_WITH_DOWNLOAD_CODE) を作成するために
 * 対象のauditLogに対応したproductIdを読み込む必要があるが、2020/07/24時点で対象のauditLog/{}/params.productIdに保存されていない。
 * 都度downloadCodeSetを読み込ませないために、リリース前にマイグレーションを行う
 */
import * as fs from "fs";

import firebaseAdmin from "firebase-admin";
import { Logger, LogLevel } from "@firebase/logger";
import CollectionReference = firebaseAdmin.firestore.CollectionReference;

const app = firebaseAdmin.initializeApp();
const logger = new Logger(
  "fix-params-of-analytics-data-of-activate-with-download-code"
);
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

import { AuditLogDocument, LogType } from "../domains/AuditLog";
import { DownloadCodeSetDocument } from "../domains/DownloadCodeSet";

(async () => {
  const firestore = app.firestore();
  // prettier-ignore
  const auditLogColRef = firestore.collection(`auditLogs`) as CollectionReference<AuditLogDocument>;
  // prettier-ignore
  const downloadCodeSetColRef = firestore.collection(`downloadCodeSets`) as CollectionReference<DownloadCodeSetDocument>;

  const targetAuditLogSnap = await auditLogColRef
    .where("type", "==", LogType.ACTIVATE_WITH_DOWNLOAD_CODE)
    .where("ok", "==", true)
    .get();

  logger.log(`target auditLog size: ${targetAuditLogSnap.size}`);

  for (const doc of targetAuditLogSnap.docs) {
    const { params } = doc.data();
    const { code, productId } = params;

    logger.log(`auditLog code: ${code}`);

    if (!productId) {
      logger.log(`auditLog has no productId in params.`);

      const downloadCodeSet = await downloadCodeSetColRef
        .where(`codes.${code}`, "==", true)
        .get();
      const { productRef } = downloadCodeSet.docs[0].data();

      await doc.ref.update({
        [`params.productId`]: productRef.id
      });
      logger.log(`success to update params. productId: ${productRef.id}`);
    } else {
      logger.log(`auditLog has productId in params :${productId}`);
    }
  }
})().catch(e => {
  logger.error(e);
});
