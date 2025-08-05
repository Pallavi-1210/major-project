const listing = require("./models/listing.js");
const review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const {reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "please logged in!");
    return res.redirect("/login"); // ✅ fix here
  }
  next();
};
// but our passport delete alll thing in seessionn after login so use locals.
//passport usy chedta nhii
module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirect = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next) => {
  let {id} = req.params;
  let Listing =  await listing.findById(id);
  if(!Listing.owner.equals(req.user._id)){
    req.flash("error" , "you don't have permission");
   return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    //It checks if the form data (`req.body`)  follows the rules of `listingSchema`.
    //If there's a problem, the `error` variable will contain the validation error details.
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// review validation
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body); 
      if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg );
     }
     else {
         next();
     }
}

module.exports.isAuthor = async(req,res,next) => {
  let {id,reviewId} = req.params;
  let Review =  await review.findById(reviewId);
  if(!Review.author.equals(req.user._id)){
    req.flash("error" , "you don't have permission");
   return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isListingFound = async (req, res, next) => {
  let { country } = req.query;
  if(!country){
     req.flash("error", "plzz enter country name");
     return res.redirect("/listings");
  }
  let searchListing = await listing.find({ country: country });
  if (searchListing.length === 0) {
    req.flash("error", "No listing found");
    return res.redirect("/listings");
  }
  next();
};
