const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");
const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  reviews : [{
    type : schema.Types.ObjectId,
    ref : "Review",
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  category: {
  type : String,
  enum : ['Trending' , 'Rooms' , 'Iconic Cities', 'Mountains' , 'Castels',
    'Amazing Pools' , 'Camping' ,'Farms' ,'Arcatic'
  ],
  }
});

//mongoose middleware
listingSchema.post("findOneAndDelete" , async (listing) => {
 if(listing.reviews.length){
    await Review.deleteMany( {_id : {$in : listing.reviews }});
 }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
