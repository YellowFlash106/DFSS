const router = require("express").Router();

const { uploadChunk, getUploadedChunks } = require("../controllers/upload.controller");
const upload = require("../utils/multer");
const authenticate = require("../middleware/auth.middleware");

router.use(authenticate);

const parseChunk = (req, res, next) => {
	upload.fields([
		{ name: "chunk", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	])(req, res, (error) => {
		if (error) {
			return next(error);
		}

		req.file = req.files?.chunk?.[0] || req.files?.file?.[0];
		next();
	});
};

router.post("/upload-chunks", parseChunk, uploadChunk);
router.get("/uploaded-chunks/:fileId", getUploadedChunks);

module.exports = router;