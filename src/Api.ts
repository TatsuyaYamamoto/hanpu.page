import * as express from "express";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.json([{ rout: true }]);
});

apiRouter.get("/users", (req, res) => {
  res.json([{ id: "id" }]);
});

export default apiRouter;
