// tslint:disable:no-console
import { https, config, region } from "firebase-functions";
import { initializeApp, credential } from "firebase-admin";

import { backupFirestoreData } from "./utils/gcp";

// Load Environment Variables on Functions
const {
  // text of serviceAccount.json
  service_account
} = config();

const appOptions = !!service_account
  ? {
      ...JSON.parse(process.env.FIREBASE_CONFIG as string),
      credential: credential.cert(service_account)
    }
  : {};

// TODO: 保存期間の方針を検討してちょうだい
const MAX_BACKUP_DATE_LENGTH = 30;

// Initial Firebase App
const app = initializeApp(appOptions);

export const api = https.onRequest((_, response) => {
  response.json({
    message: "api!"
  });
});

/**
 * FirestoreのバックアップをstorageにexportするScheduledJob
 * 日本時間のAM09:00に実行される
 */
export const scheduledFirestoreBackup = region("asia-northeast1")
  .pubsub.schedule("00 09 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async context => {
    console.log("run firebase scheduled job.", context);

    // Backup済みのファイルをカウントして、`MAX_BACKUP_DATE_LENGTH`を超過した分を削除する
    // 先に削除してからexportを実行しているのは、export後にBucket#getFilesを実行すると、直前のexportされたFileが含まれないため

    // implement `[backupFiles]` according to document, but don't know why
    // https://cloud.google.com/nodejs/docs/reference/storage/2.5.x/Bucket#getFiles
    const [backupFiles] = await app
      .storage()
      .bucket()
      .getFiles({
        prefix: "backups"
      });

    const backupDates = backupFiles
      // extract backup date string
      .map(file => {
        return file.name.split("/")[1];
      })
      // remove duplicates
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      // sort by date
      .sort()
      // make desc
      .reverse();

    console.log(`dates backed-up: ${backupDates}`);

    const deleteDates = backupDates.slice(MAX_BACKUP_DATE_LENGTH);
    console.log(`dates to be deleted: ${deleteDates}`);

    const deleteFilePromises: Promise<any>[] = [];
    const deleteFileKeys: string[] = [];

    // 無駄なループを回す実装だが、`deleteDates`は基本的にlength===1を想定しているので、良しとする
    for (const deleteDate of deleteDates) {
      for (const backupFile of backupFiles) {
        if (!backupFile.name.startsWith(`backups/${deleteDate}`)) {
          continue;
        }

        deleteFileKeys.push(backupFile.name);
        deleteFilePromises.push(backupFile.delete());
      }
    }

    await Promise.all(deleteFilePromises);

    const deleteLength = deleteFileKeys.length;
    console.log(
      `success to delete ${deleteLength} backup date files.`,
      deleteFileKeys
    );

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
