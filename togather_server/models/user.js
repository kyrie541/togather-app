const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //note1

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String
  }
});

userSchema.pre("save", async function(next) {
  //note2
  try {
    if (!this.isModified("password")) {
      //note3
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10); //note4
    this.password = hashedPassword; //note1
    return next();
  } catch (err) {
    return next(err); //note5
  }
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
  //note6
  try {
    let isMatch = await bcrypt.compare(candidatePassword, this.password); //note7
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
