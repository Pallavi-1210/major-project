const review = require("../models/reviews.js"); // r capital use krna h
const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

 module.exports.addReview = async(req,res) => {
  let { id } = req.params;
  let listing_find = await listing.findById(id);

   let newRev = new review(req.body.review);
   newRev.author = req.user._id;
  //  console.log(newRev.author);
   await newRev.save();

  listing_find.reviews.push(newRev);
  await listing_find.save();
  req.flash("sucess" , "New review created successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req,res) => {
 let { id,reviewId } = req.params;
 console.log("req.params:", req.params);
  await listing.findByIdAndUpdate(id ,{$pull : {reviews: reviewId}});
 //listing ke nadr jo review wlaa part h umy us review ko pull/dlt krro  jikse value reviewId ke tra h
  await review.findByIdAndDelete(reviewId);
  req.flash("sucess" , " review deleted successfully!");
  res.redirect(`/listings/${id}`);
}
