import { https } from "firebase-functions";

import * as express from "express";

import apiRouter from "./Api";

const app = express();
app.use("/api", apiRouter);

const api = https.onRequest(app);

export { api };
