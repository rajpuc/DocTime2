const PatientModel = require("../../models/Patient/PatientModel");

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, mobile_number, weight, age, HBsAg } = req.body;

    // Validation
    if (!name || !mobile_number || !weight || !age) {
      return res.status(400).json({ status: "fail", message: "Name, mobile number, weight, and age are required." });
    }

    // Check for duplicate mobile number
    const existing = await PatientModel.findOne({ mobile_number });
    if (existing) {
      return res.status(409).json({ status: "fail", message: "Mobile number already exists." });
    }

    const newPatient = await PatientModel.create({
      name,
      mobile_number,
      weight,
      age,
      HBsAg,
    });

    res.status(201).json({
      status: "success",
      message: "Patient created successfully.",
      data: newPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: patients,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get single patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await PatientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ status: "fail", message: "Patient not found." });
    }

    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile_number, weight, age, HBsAg } = req.body;

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      { name, mobile_number, weight, age, HBsAg },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ status: "fail", message: "Patient not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Patient updated successfully.",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PatientModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Patient not found." });
    }

    res.status(200).json({ status: "success", message: "Patient deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};


// Search patients by keyword (name, mobile_number, or patient_id)
exports.searchPatient = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        status: "fail",
        message: "Keyword is required for search.",
      });
    }

    // Check if keyword is a number (could be patient_id)
    const isNumeric = /^\d+$/.test(keyword);

    const searchQuery = isNumeric
      ? {
          $or: [
            { patient_id: parseInt(keyword) },
            { mobile_number: { $regex: keyword, $options: "i" } },
          ],
        }
      : {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { mobile_number: { $regex: keyword, $options: "i" } },
          ],
        };

    const patients = await PatientModel.find(searchQuery).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Search result.",
      results: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};
