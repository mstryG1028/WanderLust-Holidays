const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
});

// Note: since there is no username in schema but passport local will generate it automatically

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

// Note: We use PBKDF2 algorithms in passport hashing
