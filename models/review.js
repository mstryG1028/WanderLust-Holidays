const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Example: rating should be between 1 and 5
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
