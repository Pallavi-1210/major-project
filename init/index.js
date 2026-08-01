require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL =
    process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("DB Connected");
}

main()
    .then(() => initDb())
    .catch((err) => console.log(err));

async function initDb() {
    try {
        // Delete all old listings
        await Listing.deleteMany({});
        console.log("Old listings deleted");

        // Add default owner to every listing
        const data = initdata.data.map((obj) => ({
            ...obj,
            owner: "687b3a9c054e94cd3419291d",
        }));

        // Insert fresh listings
        await Listing.insertMany(data);
        console.log("Data initialized successfully");
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}