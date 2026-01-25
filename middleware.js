// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const ExpressError = require("./utils/ExpressError.js");
// const Joi = require("joi"); // ✅ Added Joi

// // -------------------- JOI SCHEMA --------------------
// const listingSchema = Joi.object({
//   title: Joi.string().required(),
//   description: Joi.string().required(),
//   price: Joi.number().min(0).required(),
//   location: Joi.string().required(),
//   country: Joi.string().required(),
//   image: Joi.string().allow("") // optional field
// });

// // const reviewSchema = Joi.object({
// //   rating: Joi.number().min(1).max(5).required(),
// //   body: Joi.string().required()
// // });


// module.exports.reviewSchema = Joi.object({
//   review: Joi.object({
//     rating: Joi.number().min(1).max(5).required(),
//     comment: Joi.string().required(),
//   }).required(),
// });


// // -------------------- AUTH MIDDLEWARE --------------------
// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.session.redirectUrl = req.originalUrl;
//     req.flash("error", "You must be logged in!");
//     return res.redirect("/login");
//   }
//   next();
// };

// module.exports.saveRedirectUrl = (req, res, next) => {
//   if (req.session.redirectUrl) {
//     res.locals.redirectUrl = req.session.redirectUrl;
//   }
//   next();
// };

// // -------------------- OWNER / REVIEW CHECK --------------------
// module.exports.isOwner = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);

//   if (!listing) {
//     req.flash("error", "Listing not found!");
//     return res.redirect("/listings");
//   }
//   if (!listing.owner.equals(req.user._id)) {
//     req.flash("error", "You don't have permission!");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// };

// module.exports.isReviewAuthor = async (req, res, next) => {
//   let { id, reviewId } = req.params;
//   let review = await Review.findById(reviewId);
//   if (!review.author._id.equals(res.locals.currUser._id)) {
//     req.flash("error", "You don't have permission!");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// };

// // -------------------- VALIDATION MIDDLEWARE --------------------
// module.exports.validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     throw new ExpressError(400, error);
//   } else {
//     next();
//   }
// };

// module.exports.validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     throw new ExpressError(400, error);
//   } else {
//     next();
//   }
// };



const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require("joi");

/* -------------------- JOI SCHEMAS -------------------- */

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.string().allow("")
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});

/* -------------------- AUTH MIDDLEWARE -------------------- */

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

/* -------------------- AUTHORIZATION -------------------- */

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

/* -------------------- VALIDATION -------------------- */

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};
