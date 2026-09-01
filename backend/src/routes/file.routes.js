const router = require("express").Router();

const { createFile, getFiles, finalizeFile, getFileById } = require("../controllers/file.controller");

const authenticate = require("../middleware/auth.middleware");
const rateLimiter = require("../middleware/rateLimiter");

router.post("/uploads", uploadFile);
router.get("/get-files", getFiles);
router.get("/get-file/:fileId", rateLimiter, getFileById);
router.post("/finalize-file", finalizeFile);

module.exports = router;