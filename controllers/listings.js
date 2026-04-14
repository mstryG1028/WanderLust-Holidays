const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { category, location, price, search } = req.query;

  let filter = {};

  // Category filter
  if (category && category !== "") {
    filter.category = category;
  }

  // Location filter (case-insensitive)
  if (location && location.trim() !== "") {   // trim is used to remove extra spaces from seach content
    filter.location = { $regex: location, $options: "i" };
  }

  // Price filter (max price)
  if (price && price !== "") {
    filter.price = { $lte: Number(price) };
  }
  if (search && search.trim() !== "") {
    filter.$or = [
      { title: { $regex: search, $options: "i" } }, // if we are filtering with regex, it is only used for string
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
     if (!isNaN(search)) {
    filter.$or.push({ price: Number(search) });
  }
  }
 

  const allListings = await Listing.find(filter);

  res.render("index", {
    allListings,
    filters: req.query, // send all filters to frontend
  });
};
module.exports.newListing = (req, res) => res.render("new");

module.exports.createListing = async (req, res) => {
  const { title, description, category, price, country, location, image } =
    req.body;

  const newListing = new Listing({
    title,
    description,
    category,
    price,
    country,
    location,
    owner: req.user._id,
  });

  if (req.file) {
    newListing.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    };
  } else if (image?.trim()) {
    newListing.image = { url: image.trim(), filename: "external-url" };
  } else {
    newListing.image = {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      filename: "default-image",
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showList = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Exist!");
    return res.redirect("/listings");
  }

  res.render("show", { listing });
};

module.exports.editListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing Deleted!");
    return res.redirect("/listings");
  }

  res.render("edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (req.file) {
    listing.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

// controllers/listingController.js

module.exports.searchListings = async (req, res) => {
  const query = req.query.q;

  console.log(query);
  if (!query || query.trim() === "") {
    return res.redirect("/listings");
  }

  const allListings = await Listing.find({
    $text: { $search: query },
  }).limit(10);

  console.log("Results", allListings);
  res.render("index", { allListings });
};
