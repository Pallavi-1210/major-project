const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("db created");
})
.catch((err) => {
    console.log(err);
});

async function main() {
await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>( {
    ...obj , owner:"687b3a9c054e94cd3419291d"
    }));
     await listing.insertMany(initdata.data);
     console.log("data was initilized");
}
initDb();

