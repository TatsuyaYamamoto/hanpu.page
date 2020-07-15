// 型定義がconflictするので、requireを使う
// node_modules/firebase-admin/node_modules/@google-cloud/firestore/types/firestore.d.ts(23,1): error TS6200: Definitions of the following identifiers conflict with those in another file: DocumentData, UpdateData, Firestore, GeoPoint, Transaction, WriteBatch, WriteResult, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, OrderByDirection, WhereFilterOp, Query, QuerySnapshot, DocumentChangeType, CollectionReference, FieldValue, FieldPath, Timestamp, v1beta1, v1, OK, CANCELLED, UNKNOWN, INVALID_ARGUMENT, DEADLINE_EXCEEDED, NOT_FOUND, ALREADY_EXISTS, PERMISSION_DENIED, RESOURCE_EXHAUSTED, FAILED_PRECONDITION, ABORTED, OUT_OF_RANGE, UNIMPLEMENTED, INTERNAL, UNAVAILABLE, DATA_LOSS, UNAUTHENTICATED, FirebaseFirestore
// tslint:disable-next-line:no-var-requires
const firestore = require("@google-cloud/firestore");
import moment from "moment-timezone";

import { projectId } from "../functions/processEnv";

/**
 * @see https://firebase.google.com/docs/firestore/solutions/schedule-export?hl=ja
 */
export const backupFirestoreData = async () => {
  const timestamp = moment.tz("Asia/Tokyo").format("YYYY-MM-DD_HH-mm");
  const firestoreClient = new firestore.v1.FirestoreAdminClient();

  // https://googleapis.dev/nodejs/firestore/latest/v1.FirestoreAdminClient.html#databasePath
  const databaseName = firestoreClient.databasePath(projectId, "(default)");
  const backupBucket = `gs://${projectId}.appspot.com`;
  const outputUriPrefix = `${backupBucket}/backups/${timestamp}`;
  const exportCollections = ["auditLogs", "downloadCodeSets", "products"];

  // https://googleapis.dev/nodejs/firestore/latest/v1.FirestoreAdminClient.html#exportDocuments
  return firestoreClient.exportDocuments({
    name: databaseName,
    outputUriPrefix,
    collectionIds: exportCollections
  });
};
