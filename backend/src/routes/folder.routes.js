const router = require("express").Router();

const { createFolder, getFolders } = require("../controllers/folder.controller");
const authenticate = require("../middleware/auth.middleware");

router.use(authenticate);

router.post("/create-folder", createFolder);
router.get("/get-folder", getFolders);

module.exports = router;

