
const User=require("../models/user");

module.exports.renderSignUpForm=(req, res) => {
    res.render("signup.ejs");
  };

  module.exports.signUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      // Since we haven't declare the username or password in userSchema
      // still this method will declare all these fields using passport
      req.login(registeredUser, (err) => {
        if (err) {
           req.flash("error", "Login failed. Please try again.");
         return res.redirect("/signUp");
        }
        req.flash("success", "Welcome To  World Wanderlust!");
         return res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
       return res.redirect("/signup");
    }
  };

  module.exports.renderLoginForm=(req, res) => {
    res.render("login.ejs");
  };

  module.exports.login=async (req, res) => {
    req.flash("success", "welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //if we just login then redirect listings else redirectUrl
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  };

  module.exports.logout=(req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Logged Out!");
      res.redirect("/listings");
    });
  };