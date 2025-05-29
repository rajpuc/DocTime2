const MedicineModel = require("../../models/Medicine/MedicineModel");

// Create new medicine
exports.createMedicine = async (req, res) => {
  try {
    const { name, group_name, schedule } = req.body;

    if (!name || !group_name || !schedule) {
      return res.status(400).json({ status: "fail", message: "All fields are required." });
    }

    const newMedicine = await MedicineModel.create({ name, group_name, schedule });

    res.status(201).json({
      status: "success",
      message: "Medicine created successfully.",
      data: newMedicine,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await MedicineModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get single medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await MedicineModel.findById(id);

    if (!medicine) {
      return res.status(404).json({ status: "fail", message: "Medicine not found." });
    }

    res.status(200).json({ status: "success", data: medicine });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Update medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, group_name, schedule } = req.body;

    const updatedMedicine = await MedicineModel.findByIdAndUpdate(
      id,
      { name, group_name, schedule },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ status: "fail", message: "Medicine not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Medicine updated successfully.",
      data: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await MedicineModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Medicine not found." });
    }

    res.status(200).json({ status: "success", message: "Medicine deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error.", error: error.message });
  }
};


// Search medicines by keyword (name, group_name)
exports.searchMedicine = async (req, res) => {
  try {
    const {keyword} = req.query;

    if (!keyword) {
      return res.status(400).json({
        status: "fail",
        message: "Keyword is required for search.",
      });
    }

    // Case-insensitive partial match on name, group_name
    const regex = new RegExp(keyword, "i");
    const medicines = await MedicineModel.find({
      $or: [
        { name: regex },
        { group_name: regex }
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      total: medicines.length,
      message:"Successfully retrived medicine",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server error during medicine search.",
      error: error.message,
    });
  }
};


