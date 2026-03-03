<<<<<<< HEAD




// const mongoose = require("mongoose");
// const Listing = require("../models/listing.js");
// const initData = require("./data.js"); 

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => console.log("Connected to Atlas"))
//   .catch((err) => console.log(err));

=======
// const mongoose = require("mongoose");
// const path=require("path");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
//  const MONGO_URL="mongodb+srv://mistrydeepak1028_db_user:wander123@wander.f7fe7wp.mongodb.net/?appName=wander"

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

>>>>>>> 207c6ee9cffcb22ac45e14764181a47eea03841b
// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   try {
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData);
//     console.log("Data was initialized successfully!");
//     mongoose.connection.close(); 
//   } catch (err) {
//     console.log(err);
//   }
// };

<<<<<<< HEAD
// // initDB();
=======
// initDB();


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
>>>>>>> 207c6ee9cffcb22ac45e14764181a47eea03841b
