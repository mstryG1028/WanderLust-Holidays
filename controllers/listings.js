const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index", { allListings });
};

module.exports.newListing = (req, res) => res.render("new");

module.exports.createListing = async (req, res) => {
  const { title, description, price, country, location, image } = req.body;

  const newListing = new Listing({
    title,
    description,
    price,
    country,
    location,
    image,
    owner: req.user._id
  });

  if (req.file) {
    newListing.image = { url: `/uploads/${req.file.filename}`, filename: req.file.filename };
  } else if (image?.trim()) {
    newListing.image = { url: image.trim(), filename: "external-url" };
  } else {
    newListing.image = { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", filename: "default-image" };
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
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (req.file) {
    listing.image = { url: `/uploads/${req.file.filename}`, filename: req.file.filename };
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
