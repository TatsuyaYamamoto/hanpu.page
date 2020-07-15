/**
 * https://cloud.google.com/functions/docs/env-var?hl=ja
 */

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "");

export const projectId = firebaseConfig.projectId;
