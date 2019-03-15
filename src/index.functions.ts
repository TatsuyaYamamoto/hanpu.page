import * as functions from "firebase-functions";

const demo = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export { demo };
