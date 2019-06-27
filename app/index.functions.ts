import * as functions from "firebase-functions";
import { initializeApp, auth as firebaseAuth } from "firebase-admin";

import { firestore_v1, google } from "googleapis";
import * as dateFormat from "dateformat";

import ExportDocuments = firestore_v1.Params$Resource$Projects$Databases$Exportdocuments;
import Firestore = firestore_v1.Firestore;

const app = initializeApp();

const projectId = process.env.GCLOUD_PROJECT;
const backupBucket = `gs://${projectId}.appspot.com`;
const exportCollections = ["auditLogs", "downloadCodeSets", "products"];

export const api = functions.https.onRequest((request, response) => {
  response.json({
    message: "api!"
  });
});

export const exportFirestore = functions.https.onRequest(async (req, res) => {
  const timestamp = dateFormat(new Date(), "yyyy-mm-dd_hh-MM");

  // const c = await app.options.credential.getAccessToken();
  // const oauth = new google.auth.OAuth2();
  // oauth.setCredentials({
  //   access_token: c.access_token
  // });
  //
  // // https://cloud.google.com/functions/docs/concepts/services#using_services_with_cloud_functions
  // const auth = await google.auth.getClient({
  //   projectId,
  //   clientOptions: oauth,
  //   // credentials: {
  //   //   private_key:
  //   //     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAGNx0C1NjOpEi\nyz91q/AE+GTt2KGSPRqEyML2tqh5TJ6hGoFFhbJ0LLGPjCIEnJplqctK3dz8ivcS\nIvRDQwS2c/ATWG4VflEjJNE0pVGfvAmqrt6Trh98MrhyyzvBxif/CdpCuTZKpKP2\noTMpJaMG8hZwdNiCytf4vO+pdE+q0iNWvzQagHLDTu9rnSLPhBXvx46AQgxgCDgZ\nfJMCjYWuOsWmlz64XlWakZVcaFwVYx9Z6wKA8s/xbLCtVEc+lp/ygjQbYrJP9z3x\nPudeN/WD/eEDWFggoTlSnDtasKcvej+PKrbTY4mCU3v8S5n6NVwXvHKV+zhFth43\nH3g5yz3hAgMBAAECggEAFWAO09jYyA9hzAHax2DA/gSX0oGLBQdIlqLyUtqjZ4/3\njMyyusY0Q8ofXe5FcMbuRUa+CNAkQXPDJ2D9Vii0cwr2mWh7I2ghZiw4HUgSC5i0\naKo5uSwkc8D/FkL4HMlMdQwnHcqXOHoWhqCMXVVDTUgN6CiQWQlyO8rmTjBTlxnG\nmQIaWgKl46o5KfMWlNfuttYJP2AXEc9dB0lYSMc5GMQjELEKLeu17tqQV3m/nttK\nvmeztMR/K41dV+qVj+HlEJ7uUr/YsNa9ITBb/RjAT05awhd2gK/MSbGqqoQtpAi+\n23kzKM1penQceHlWezr8OdZvY9PBtBVtEEjlsyyd+wKBgQDiZ4nu0gc96kcy8SW8\nPo8qh+sMI9Sh821zoLBSnYU6IePNSpfT+EMul018J6cyZ1OgwqQoa+SMV72oNfVe\n9wW7oggQpxoNOaJzcbp49qgjkdHO3lnSP9eY2CmsmsFvIBgYwehN8V3lejqqrQpD\nEBfBN7ySxKkmB2rjeZAfRS6ACwKBgQDZNUCPyd5vF8ITxwDIAFfOnEx9ZZhrtYTi\nrJBg07MDUinL58xGML4u37kGXv/tJ+3X31ksLOJ0rL6JD94TCb+VMCnbOGOx7dKx\n0nhC5NvuGQtwXfYPOCt7Uga0Ki8Rk/oxd0TPSGbn1z7tIICv7/G1UKB4O4G5gS5Z\nzPRlgL0RQwKBgCr5rF0A0Q8XoVwyGg+ZcGOKWTt8safsJSKFpfKIo/lc5XjaZ+d8\ngIQfhD3E6R/QLTeeurpRgJiDLyT22RSlnxj2sME4duF7xzJSrCq550CZNVInMrWO\nGMaSgZaZ6Y3GccyBQi9JWaFtiiVLo18HdvreMZVKbzEgx1FWidzlrOXxAoGAenCB\nT0ydHYSH+3wPXa6L0MTcfUdaz0SIfvqFfH95hqK3OuEUjnCFlIi6lPPSUo5SjYCy\nlKtMkDacRUjzh0nUfDWlMpUr5a3JOkIJVrQJocLuZs4gmV2xbRfE/aRV2hPPUjkI\nScxnbcMxDpxmzkZ0ux+TBZONwdMnHKnjDqCuc18CgYEAsV8UtwcwsqHpt41ZJuAP\nh3+MsFPVWP5zOjBxmnBs2aw8Xq3T5V5pMfc1U3aWybLKlIn4diZA5lnjY5r34w6+\nx0QJWjPHTNXXOA0Exa87cTlEdNhu60mIR23ArrFA524O6Ec64DKCFcb86J0Ckvx4\n0U/eSb9BK+fHlESGqcC5jJw=\n-----END PRIVATE KEY-----\n",
  //   //   client_email:
  //   //     "firebase-adminsdk-h1f43@dl-code-dev.iam.gserviceaccount.com"
  //   // },
  //   scopes: [
  //     "https://www.googleapis.com/auth/datastore",
  //     "https://www.googleapis.com/auth/cloud-platform"
  //   ]
  // });

  const accessToken = await app.options.credential.getAccessToken();

  const params: ExportDocuments = {
    access_token: accessToken.access_token,
    name: `projects/${projectId}/databases/(default)`,
    requestBody: {
      collectionIds: exportCollections,
      outputUriPrefix: `${backupBucket}/${timestamp}`
    }
  };

  const firestore = new Firestore({});

  try {
    const result = await firestore.projects.databases.exportDocuments(params);

    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: true,
      message: error.message
    });
  }
});
