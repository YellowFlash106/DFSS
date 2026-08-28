const router = require("express").Router();

const { uploadFile, getFiles } = require("../controllers/file.controller");

router.post("/upload", uploadFile);
router.get("/get-files", getFiles);

module.exports = router;