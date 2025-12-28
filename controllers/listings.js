const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  };

  module.exports.newListing=async (req, res) => {
    res.render("new.ejs");
  };



module.exports.createListing = async (req, res) => {
  const { title, description, price, country, location, imageUrl } = req.body;
  const newListing = new Listing({ title, description, price, country, location });
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = { url: `/uploads/${req.file.filename}`, filename: req.file.filename };
  } else if (imageUrl && imageUrl.trim() !== "") {
    newListing.image = { url: imageUrl.trim(), filename: "external-url" };
  } else {
    newListing.image = {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      filename: "default-image"
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

  module.exports.showList=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner"); 

    if (!listing) {     // if curr listing is deleted or not available then this message will pop up
      req.flash("error", " Listing Not Exist!");
      return res.redirect("/listings");
    };

    res.render("show.ejs", { listing });
  };

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing is deleted!");
    return res.redirect("/listings");
  }

  // Safe way to get image URL
  let originalImageUrl = listing.image?.url || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688";
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("edit.ejs", { listing, originalImageUrl });
};

  module.exports.updateListing=async (req, res) => {  // wrapAsynk is function used to handle error defined in utils folder
    
    let { id } = req.params;
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body });

   if( typeof req.file !== "undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
   }
    req.flash("success", " List Edited!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted Successfully!");
    res.redirect("/listings");
  };