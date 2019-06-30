// tslint:disable:no-console
import { https, config, region } from "firebase-functions";
import { initializeApp, credential } from "firebase-admin";

import { backupFirestoreData } from "./utils/gcp";

// Load Environment Variables on Functions
const {
  // text of serviceAccount.json
  service_account
} = config();

// Initial Firebase App
const app = initializeApp({
  ...JSON.parse(process.env.FIREBASE_CONFIG),
  credential: credential.cert(service_account)
});

export const api = https.onRequest((request, response) => {
  response.json({
    message: "api!"
  });
});

// 日本時間のAM09:00に実行される
export const scheduledFirestoreBackup = region("asia-northeast1")
  .pubsub.schedule("00 09 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async context => {
    console.log("run firebase scheduled job.", context);

    try {
      const result = await backupFirestoreData({
        client_email: service_account.client_email,
        private_key: service_account.private_key
      });
      console.log("success to backup-export.", result);
    } catch (error) {
      console.error("fail to backup-export.", error);
    }
  });
