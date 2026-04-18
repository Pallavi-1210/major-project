require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "687b3a9c054e94cd3419291d" // Default owner ID
    }));

    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initDb();
