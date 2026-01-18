const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// used for storing images and videos
const multer=require("multer");
// const { storage }=require("../cloudConfig.js");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload=multer({ storage });


// NOTE: (router.route is used to minimizw the code when two routes are same then those are written in same route express("/"));

router.route("/")
//ALL LISTS
.get( wrapAsync(listingController.index) ) //for getting listings, all the code is written in controller.listing file using mvc frameworks
//create route
.post(
  isLoggedIn,
 // this middleware will check either all info is correct or not before saving into database
 validateListing, 
 upload.single('image'),
  
  wrapAsync(listingController.createListing)
);



//new route
router.get(
  "/new",
  isLoggedIn, // This is a middleware used to check either user is loggedIn or not before saving new Listing
  wrapAsync(listingController.newListing)
);

router.route("/:id")
//show route
.get( wrapAsync(listingController.showList))
//update route
.put(
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
//delete route
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);


//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner, // before editing the listing it will check either user is loggedIn or not
  wrapAsync(listingController.editListing)
);

module.exports = router;
