const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    history: { type: String },
    complaints: { type: String },
    obsteric: { type: String },
    menstrual: { type: String },
    vaccine: { type: String },
    past_medical: { type: String },
    past_surgical: { type: String },
    family_social: { type: String }, // changed from "family/social" for safety
    contraceptive: { type: String },
    drug: { type: String },
    examination: { type: String },
    general: { type: String },
    obsterical: { type: String },
    abdominal: { type: String },
    pelvic: { type: String },
    investigation: { type: String },
    provisional_dx: { type: String },
    special_note: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PrescriptionModel = mongoose.model("Prescription", prescriptionSchema);
module.exports = PrescriptionModel;
