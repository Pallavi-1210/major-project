const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js"); 
const review = require("../models/reviews.js"); // r capital use krna h
const {validateReview, isLoggedIn,isAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

// add reviews route
router.post("/", isLoggedIn,validateReview,
    wrapAsync(reviewController.addReview));

//delete reviews route
router.delete("/:reviewId" , 
  isLoggedIn,
  isAuthor,
   reviewController.deleteReview);


module.exports = router;