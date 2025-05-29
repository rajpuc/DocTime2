const mongoose = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose);

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    patient_id: {
      type: Number,
      unique: true,
    },
    mobile_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    HBsAg: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Apply auto-increment plugin to patient_id
patientSchema.plugin(AutoIncrement, {
  inc_field: "patient_id",
  start_seq: 1,
});

const PatientModel = mongoose.model("Patient", patientSchema);
module.exports = PatientModel;
