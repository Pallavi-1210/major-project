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

  // ✅ FIXED IMAGE FIELD (with default)
  image: {
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    },
    filename: {
      type: String,
      default: "default"
    }
  },

  price: Number,
  location: String,
  country: String,

  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  },


  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    }
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  category: {
    type: String,
    enum: [
      'Trending',
      'Rooms',
      'Iconic Cities',
      'Mountains',
      'Castels',
      'Amazing Pools',
      'Camping',
      'Farms',
      'Arcatic'
    ],
  }
});

// ✅ DELETE REVIEWS WHEN LISTING DELETED
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;