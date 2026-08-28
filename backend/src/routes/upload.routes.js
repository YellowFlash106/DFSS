const router = require("express").Router();

const uploadController = require("../controllers/upload.controller");
const upload = require("../utils/multer");

router.post("/upload-chunk", uploadController.uploadChunk);
module.exports = router;