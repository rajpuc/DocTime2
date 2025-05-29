const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group_name: {
      type: String,
      required: true,
      trim: true,
    },
    schedule: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MedicineModel = mongoose.model("Medicine", medicineSchema);
module.exports=MedicineModel;
