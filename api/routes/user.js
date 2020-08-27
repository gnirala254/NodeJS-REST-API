const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const UserController = require("../controllers/user");

router.post("/signup", UserController.user_signup_user);

router.post("/login", UserController.user_login_user);

router.delete("/:userId", checkAuth, UserController.user_delete_user);

module.exports = router;
