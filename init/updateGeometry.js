require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing");

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  console.log("❌ ATLASDB_URL missing in .env");
  process.exit(1);
}

async function main() {
  await mongoose.connect(dbUrl);

  console.log("Connected to DB");
  console.log("USING DB:", dbUrl);

  const allListings = await Listing.find({});
  console.log(`Found ${allListings.length} listings`);

  let updated = 0;

  for (let item of allListings) {
    try {
      const query = `${item.location}, ${item.country}`;

      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=${process.env.OPENCAGE_KEY}`
      );

      const data = await res.json();

      if (data?.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry;

        await Listing.updateOne(
          { _id: item._id },
          {
            $set: {
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
            },
          }
        );

        console.log("UPDATED ✅:", item.title);
        updated++;
      } else {
        console.log("NO DATA ❌:", item.title);
      }
    } catch (err) {
      console.log("ERROR ❌:", item.title, err.message);
    }

    // API safe delay
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("DONE. Updated:", updated);
  mongoose.connection.close();
}

main().catch((err) => {
  console.log("FATAL ERROR:", err.message);
});