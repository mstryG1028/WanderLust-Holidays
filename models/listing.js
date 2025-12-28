const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const sampleListings=require("../init/data");
const connectDB=async()=>{
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust1");
  console.log("conn to DB")
}
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  image: {
    url: String,
    filename: String,
  },

  description: String,
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
// category:{
//   type:String,
//   enum:["mountains","arctic","farms",]    //home work
// }
});
// data.forEach(element => {
//   const newList=Listing.save({

//   })
//   newList.save();
// });

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

const initDB=async()=>{
  await connectDB();
  await Listing.deleteMany({});
  await Listing.insertMany(sampleListings)
  console.log("saved");
  mongoose.connection.close();
}
// initDB();
module.exports = Listing;
