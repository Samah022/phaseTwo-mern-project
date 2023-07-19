const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["high School", "university"],    
  },
  employeeType: {
    type: String,
    enum: ["full-time", "part-time","freelancer"],
  },
  yearOfGraduate: {
    type: Date,
  },
  image: {
    type: String,
    required: true,
  },
});


const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;