const PrescriptionMedicineModel = require("../../models/Prescription/PrescriptionMedicineModel");

// CREATE a new prescription medicine
exports.createPrescriptionMedicine = async (req, res) => {
  try {
    const { prescription_id, patient_id, medicine_name, schedule } = req.body;

    if (!prescription_id || !patient_id || !medicine_name || !schedule) {
      return res.status(400).json({
        status: "fail",
        message: "All fields (prescription_id, patient_id, medicine_name, schedule) are required.",
      });
    }

    const newMedicine = await PrescriptionMedicineModel.create({
      prescription_id,
      patient_id,
      medicine_name,
      schedule,
    });

    res.status(201).json({
      status: "success",
      message: "Prescription medicine created successfully.",
      data: newMedicine,
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};

// READ ALL prescription medicines
exports.getAllPrescriptionMedicines = async (req, res) => {
  try {
    const medicines = await PrescriptionMedicineModel.find()
      .populate("prescription_id")
      .populate("patient_id");

    res.status(200).json({
      status: "success",
      message: "All prescription medicines fetched successfully.",
      data: medicines,
    });
  } catch (error) {
    console.error("Read All Error:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};

// READ ONE by ID
exports.getPrescriptionMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await PrescriptionMedicineModel.findById(id)
      .populate("prescription_id")
      .populate("patient_id");

    if (!medicine) {
      return res.status(404).json({
        status: "fail",
        message: "Prescription medicine not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Prescription medicine fetched successfully.",
      data: medicine,
    });
  } catch (error) {
    console.error("Read By ID Error:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};

// UPDATE by ID
exports.updatePrescriptionMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const { prescription_id, patient_id, medicine_name, schedule } = req.body;

    const updatedMedicine = await PrescriptionMedicineModel.findByIdAndUpdate(
      id,
      { prescription_id, patient_id, medicine_name, schedule },
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        status: "fail",
        message: "Prescription medicine not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Prescription medicine updated successfully.",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};

// DELETE by ID
exports.deletePrescriptionMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PrescriptionMedicineModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Prescription medicine not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Prescription medicine deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};
