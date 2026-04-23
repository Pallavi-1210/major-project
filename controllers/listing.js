const axios = require("axios");
const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });  
};

module.exports.newRenderform = (req, res) => {
    res.render("listings/new");
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    // ✅ small 'listing' as per your code
    const newListing = new listing(req.body.listing);
        // Geocoding with Nominatim API (OpenStreetMap)
    let geometry = null;
    try {
        const query = `${newListing.location}, ${newListing.country}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, {
            headers: { "User-Agent": "WanderlustApp/1.0" }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            let lat = parseFloat(data[0].lat);
            let lng = parseFloat(data[0].lon);
            geometry = { type: 'Point', coordinates: [lng, lat] };
        }
    } catch (err) {
        console.error("Geocoding error:", err);
    }
    if (geometry) {
        newListing.geometry = geometry;
    }
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const oneListing = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");
    if (!oneListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { oneListing ,
         coordinates: oneListing.geometry?.coordinates
    });
};

module.exports.renderEditform = async (req, res, next) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    let originalImageUrl = editListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/uploads/w_300");
    res.render("listings/edit", { editListing, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
    if (!req.body.listing) {
        next(new ExpressError(400, "Send valid data"));
    }

    let { id } = req.params;
    let updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file !== undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

module.exports.filterListing = async (req, res) => {
    let { category } = req.query;

    let allListings = await listing.find({});
    let filterListing = allListings.filter(i => i.category == category);

    res.render("listings/filter", { filterListing });
};

module.exports.searchListing = async (req, res) => {
    let { country } = req.query;
    let searchListing = await listing.find({ country: country });
    res.render("listings/search", { searchListing });
};
