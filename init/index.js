
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://mistrydeepak1028_db_user:wander123@wander.f7fe7wp.mongodb.net/?appName=wander";

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = initData.map((obj) => ({
    ...obj,
    owner: "69a18bcae528d0b53b5df013"
  }));

  await Listing.insertMany(updatedData);

  console.log("Data was initialized");
};

initDB();

