const mongoose = require("mongoose");

const prescriptionMedicineSchema = new mongoose.Schema(
  {
    prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicine_name: {
      type: String,
      trim: true,
      required: true
    },
    schedule: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PrescriptionMedicineModel = mongoose.model(
  "PrescriptionMedicine",
  prescriptionMedicineSchema
);
module.exports = PrescriptionMedicineModel;
