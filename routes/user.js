const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// NOTE: (router.route is used to minimizw the code when two routes are same then those are written in same route express("/"));


router.route("/signup")
.get( userController.renderSignUpForm)
.post( userController.signUp);


router.route("/login")
.get( userController.renderLoginForm)

// This method will automatically checks either currUser is registerd or not
.post(
  
  saveRedirectUrl,
  passport.authenticate("local", {
    // it will get values of currUser checks in database
    failureRedirect: "/login", // if not matched
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout",userController.logout );

module.exports = router;
