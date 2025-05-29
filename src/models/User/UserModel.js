const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    mobile: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
