const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.createReview=async (req, res, next) => {
    // Ensure that the request body contains 'comment' and 'rating'
    const { comment, rating } = req.body.review;

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review({
      comment,
      rating,
    });

    newReview.author = req.user._id;

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  }

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // it will delete the partucular id from listing.reviews array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted!");
    res.redirect(`/listings/${id}`);
  }