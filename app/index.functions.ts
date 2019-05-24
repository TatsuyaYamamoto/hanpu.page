import * as functions from "firebase-functions";

export const api = functions.https.onRequest((request, response) => {
  response.json({
    message: "api!"
  });
});
