const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync");

// ================= SIGNUP =================
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

// ================= LOGIN ==================
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Welcome back to Wanderlust");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      return res.redirect(redirectUrl);
    }
  );

// ================= LOGOUT =================
router.get("/logout", userController.logout);

module.exports = router;
