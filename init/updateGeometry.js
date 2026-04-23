require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Listing = require("../models/listing");

const MONGO_URL =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

(async () => {
  await mongoose.connect(MONGO_URL);
  console.log("DB connected");

  const listings = await Listing.find({});

  for (let item of listings) {
    console.log("Updating:", item.title);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        item.location + ", " + item.country
      )}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "WanderlustApp/1.0"
        }
      });

      const data = await res.json();

      if (data.length > 0) {
        item.geometry = {
          type: "Point",
          coordinates: [
            parseFloat(data[0].lon),
            parseFloat(data[0].lat),
          ],
        };

        await item.save();
        console.log("✅ Updated:", item.title);
      } else {
        console.log("❌ No data for:", item.location);
      }

      // ⏳ delay to avoid API block
      await new Promise((r) => setTimeout(r, 1000));

    } catch (err) {
      console.log("Error:", err.message);
    }
  }

  console.log("DONE 🚀");
  mongoose.connection.close();
})();