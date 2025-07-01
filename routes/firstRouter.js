const express = require("express");
const firstRouter = express.Router();
const showController = require("../controllers/show");
firstRouter.get("/", showController.showHome);
firstRouter.get("/form", showController.showForm);
firstRouter.post("/", showController.saveDataAndShowSuccess);
firstRouter.post("/editDone/:_id",showController.saveEdit);
firstRouter.get("/result", showController.showResult);
firstRouter.get("/result/:_id", showController.showInfo);
firstRouter.get('/delete/:_id',showController.showDeleteMsg);
firstRouter.get( '/edit/:_id', showController.showEditForm);

exports.firstRouter = firstRouter;
