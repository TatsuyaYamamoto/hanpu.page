import { firestore_v1, google } from "googleapis";

import { format as dateFormat } from "date-fns";

import ExportDocuments = firestore_v1.Params$Resource$Projects$Databases$Exportdocuments;
import Firestore = firestore_v1.Firestore;

const projectId = process.env.GCLOUD_PROJECT;
const backupBucket = `gs://${projectId}.appspot.com`;
const exportCollections = ["auditLogs", "downloadCodeSets", "products"];

export const backupFirestoreData = async () => {
  const timestamp = dateFormat(new Date(), "yyyy-mm-dd_hh-MM");

  // https://cloud.google.com/functions/docs/concepts/services#using_services_with_cloud_functions
  const auth = await google.auth.getClient({
    projectId,
    scopes: [
      "https://www.googleapis.com/auth/datastore",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  });

  const params: ExportDocuments = {
    auth,
    name: `projects/${projectId}/databases/(default)`,
    requestBody: {
      collectionIds: exportCollections,
      outputUriPrefix: `${backupBucket}/backups/${timestamp}`
    }
  };

  const firestore = new Firestore({});

  return firestore.projects.databases.exportDocuments(params);
};
