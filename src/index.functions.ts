import { auth, https } from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

import * as express from "express";

import apiRouter from "./Api";
import { onUserCreated as onUserCreatedHandler } from "./functions/auth";

initializeApp();
firestore().settings({
  timestampsInSnapshots: true
});

const app = express();
app.use("/api", apiRouter);

const api = https.onRequest(app);
const onUserCreated = auth.user().onCreate(onUserCreatedHandler);

export { api, onUserCreated };
