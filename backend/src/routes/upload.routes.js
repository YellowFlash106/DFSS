const router = require("express").Router();

const { uploadChunk, getUploadedChunks } = require("../controllers/upload.controller");
const upload = require("../utils/multer");

router.post("/upload-chunks", uploadChunk);
router.get("/uploaded-chunks/:fileId", getUploadedChunks);

module.exports = router;