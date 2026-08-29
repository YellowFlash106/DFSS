const router = require("express").Router();

const { createFolder, getFolder } = require("../controllers/folder.controller");

router.post("/create-folders", createFolder);
router.get("/get-folders", getFolder);

module.exports = router;

