const express = require("express");
const router = express.Router();


const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
// const {
//   fetchCurrentUser,
//   loginWithPhoneOtp,
//   createNewUser,
//   verifyPhoneOtp,
//   handleAdmin
// } = require("../controllers/auth");

const controller = require('../controllers/auth')


router.post("/register", controller.createNewUser);

router.post("/login_with_phone", controller.loginWithPhoneOtp);

router.post("/verify", controller.verifyPhoneOtp);

router.get("/me", checkAuth, controller.fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, controller.handleAdmin);

module.exports = router;