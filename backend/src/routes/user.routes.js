const router = require("express").Router();

const authenticate = require("../middleware/auth.middleware");
const { getUser } = require("../controllers/user.controller");

router.get("/user", getUser);

module.exports = router;