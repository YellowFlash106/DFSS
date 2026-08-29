const router = require("express").Router();

const { createFolder, getFolders } = require("../controllers/folder.controller");

router.post("/create-folders", createFolder);
router.get("/get-folders", getFolders);

module.exports = router;

