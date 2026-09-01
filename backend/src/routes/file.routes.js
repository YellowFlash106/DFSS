const router = require("express").Router();

const { createFile, getFiles, finalizeFile, getFileById, getPublicFile, generatePublicLink } = require("../controllers/file.controller");

const authenticate = require("../middleware/auth.middleware");
const rateLimiter = require("../middleware/rateLimiter");


router.post("/upload", authenticate, createFile);
router.get("/get-files", authenticate, getFiles);
router.get("/get-file/:fileId", authenticate, rateLimiter, getFileById);
router.get("/:fileId", authenticate, rateLimiter, getFileById);
router.post("/finalize-file", authenticate, finalizeFile);
router.get("/public/:token", getPublicFile);
router.post("/public-link", authenticate, generatePublicLink);
router.post("/public-link/:fileId", authenticate, generatePublicLink);

module.exports = router;