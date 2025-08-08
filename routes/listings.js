const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing,isListingFound } = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer  = require('multer') // taki images backend m ajye
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


 //index  & create(save)
router.route("/")
  .get( wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing));
// create(form) ********
router.get(
  "/new" , 
  isLoggedIn,
  listingController.newRenderform);

router.get("/category"
  ,listingController.filterListing);

router.get("/search",isListingFound
  ,listingController.searchListing);

 // show(read) & update(save) & delete ********
 router.route("/:id")
 .get( wrapAsync(listingController.showListing))
 .put(
   isLoggedIn,
   isOwner ,
   validateListing,
   upload.single('listing[image]'),
   wrapAsync(listingController.updateListing))
 .delete(
    isLoggedIn ,
    isOwner ,
    wrapAsync(listingController.destroyListing));

 //edit  or update(form) *******
router.get("/:id/edit", 
    isLoggedIn,
    isOwner ,
    wrapAsync(listingController.renderEditform));



module.exports = router;