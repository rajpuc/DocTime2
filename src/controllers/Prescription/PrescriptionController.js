const mongoose = require("mongoose");

const PrescriptionMedicineModel = require("../../models/Prescription/PrescriptionMedicineModel");
const PrescriptionModel = require("../../models/Prescription/PrescriptionModel");
const PatientModel = require("../../models/Patient/PatientModel");

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const prescription = await PrescriptionModel.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Prescription created successfully.",
      data: prescription,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get all prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await PrescriptionModel.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ status: "success", data: prescriptions });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get single prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await PrescriptionModel.findById(id);

    if (!prescription) {
      return res
        .status(404)
        .json({ status: "fail", message: "Prescription not found." });
    }

    res.status(200).json({ status: "success", data: prescription });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Update prescription
exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPrescription = await PrescriptionModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedPrescription) {
      return res
        .status(404)
        .json({ status: "fail", message: "Prescription not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Prescription updated successfully.",
      data: updatedPrescription,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Delete prescription
// exports.deletePrescription = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await PrescriptionModel.findByIdAndDelete(id);

//     if (!deleted) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Prescription not found." });
//     }

//     res
//       .status(200)
//       .json({
//         status: "success",
//         message: "Prescription deleted successfully.",
//       });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: "fail", message: "Server error.", error: error.message });
//   }
// };
exports.deletePrescriptionById = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    session.startTransaction();

    // Check if prescription exists
    const prescription = await PrescriptionModel.findById(id).session(session);
    if (!prescription) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "fail",
        message: "Prescription not found",
      });
    }

    // Delete the prescription
    await PrescriptionModel.findByIdAndDelete(id).session(session);

    // Delete all related prescription medicines
    await PrescriptionMedicineModel.deleteMany({ prescription_id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "Prescription and associated medicines deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction error:", error);
    res.status(500).json({
      status: "fail",
      message: error.message || "Something went wrong during deletion",
    });
  }
};


// Create full prescription
// exports.createFullPrescription = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const     {name, mobile_number, weight, age, HBsAg, history, complaints,obsteric, menstrual, vaccine, past_medical, past_surgical, family_social,contraceptive,drug,examination,general, obsterical, abdominal, pelvic,investigation, provisional_dx, special_note, medicines}= req.body;

//     // 1. Create Patient (if not exists)
//     // Validation
//     if (!name || !mobile_number || !weight || !age) {
//       return res.status(400).json({ status: "fail", message: "Name, mobile number, weight, and age are required." });
//     }

//         // Check for duplicate mobile number
//         const existing = await PatientModel.findOne({ mobile_number });
//         if (existing) {
//           return res.status(409).json({ status: "fail", message: "Mobile number already exists." });
//         }

//             const newPatient = await PatientModel.create({
//               name,
//               mobile_number,
//               weight,
//               age,
//               HBsAg,
//             });

//     const existingPatient = await PatientModel.findOne({ mobile_number: patient.mobile_number });
//     let patientDoc;

//     if (existingPatient) {
//       patientDoc = existingPatient;
//     } else {
//       patientDoc = await PatientModel.create([patient], { session });
//     }

//     const patient_id = patientDoc._id || patientDoc[0]._id;

//     // 2. Create Prescription
//     const newPrescription = await PrescriptionModel.create(
//       [{ ...prescription, patient_id }],
//       { session }
//     );
//     const prescription_id = newPrescription[0]._id;

//     // 3. Add Medicines
//     if (!Array.isArray(medicines) || medicines.length === 0) {
//       throw new Error("Medicines array is required and must contain at least one item.");
//     }

//     const medicineDocs = medicines.map((med) => ({
//       prescription_id,
//       patient_id,
//       medicine_name: med.medicine_name,
//       schedule: med.schedule,
//     }));

//     await PrescriptionMedicineModel.insertMany(medicineDocs, { session });

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       status: "success",
//       message: "Patient, prescription, and medicines created successfully.",
//       data: {
//         patient: patientDoc,
//         prescription: newPrescription,
//         medicines: medicineDocs,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error);
//     res.status(500).json({
//       status: "fail",
//       message: "Failed to create full prescription.",
//       error: error.message,
//     });
//   }
// };

//Create full prescription
// exports.createFullPrescription = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       patient_id,
//       history,
//       complaints,
//       obsteric,
//       menstrual,
//       vaccine,
//       past_medical,
//       past_surgical,
//       family_social,
//       contraceptive,
//       drug,
//       examination,
//       general,
//       obsterical,
//       abdominal,
//       pelvic,
//       investigation,
//       provisional_dx,
//       special_note,
//       medicines,
//     } = req.body;

//     // Validation: patient_id is required
//     if (!patient_id) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Patient ID is required.",
//       });
//     }

//     // Create the prescription
//     const prescription = await PrescriptionModel.create(
//       [
//         {
//           patient_id,
//           history,
//           complaints,
//           obsteric,
//           menstrual,
//           vaccine,
//           past_medical,
//           past_surgical,
//           family_social,
//           contraceptive,
//           drug,
//           examination,
//           general,
//           obsterical,
//           abdominal,
//           pelvic,
//           investigation,
//           provisional_dx,
//           special_note,
//         },
//       ],
//       { session }
//     );

//     // Validate and insert medicines if provided
//     let createdMedicines = [];
//     if (Array.isArray(medicines) && medicines.length > 0) {
//       for (const med of medicines) {
//         if (!med.medicine_name || !med.schedule) {
//           await session.abortTransaction();
//           return res.status(400).json({
//             status: "fail",
//             message: "Each medicine must have 'medicine_name' and 'schedule'.",
//           });
//         }
//       }

//       // Attach prescription_id and patient_id to each medicine
//       const medicineDocs = medicines.map((med) => ({
//         prescription_id: prescription[0]._id,
//         patient_id,
//         medicine_name: med.medicine_name,
//         schedule: med.schedule,
//       }));

//       createdMedicines = await PrescriptionMedicineModel.insertMany(medicineDocs, { session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       status: "success",
//       message: "Prescription created successfully with medicines.",
//       data: {
//         prescription: prescription[0],
//         medicines: createdMedicines,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({
//       status: "fail",
//       message: "Server error.",
//       error: error.message,
//     });
//   }
// };
exports.createFullPrescription = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { patient_id, medicines, ...prescriptionData } = req.body;

    console.log(patient_id, medicines, prescriptionData);
    // 1. VALIDATION PHASE (Before any DB operations)
    if (!patient_id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "fail",
        message: "Patient ID is required.",
      });
    }

    // Verify patient exists
    const patientExists = await PatientModel.exists({
      _id: patient_id,
    }).session(session);
    if (!patientExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "fail",
        message: "Patient not found.",
      });
    }

    // Validate medicines structure before proceeding
    if (medicines && !Array.isArray(medicines)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "fail",
        message: "Medicines must be an array.",
      });
    }

    // Validate medicines structure before proceeding
    if (medicines.length < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "fail",
        message: "Please Add medicine",
      });
    }

    // Validate each medicine
    if (medicines && medicines.length > 0) {
      const invalidMedicines = medicines.filter(
        (med) => !med.medicine_name || !med.schedule
      );

      if (invalidMedicines.length > 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          status: "fail",
          message: "Each medicine must have 'medicine_name' and 'schedule'.",
          invalidMedicines,
        });
      }
    }

    // 2. EXECUTION PHASE (All or nothing)
    const prescription = await PrescriptionModel.create(
      [{ ...prescriptionData, patient_id }],
      { session }
    );

    let createdMedicines = [];
    if (medicines && medicines.length > 0) {
      createdMedicines = await PrescriptionMedicineModel.insertMany(
        medicines.map((med) => ({
          prescription_id: prescription[0]._id,
          patient_id,
          medicine_name: med.medicine_name,
          schedule: med.schedule,
        })),
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "Prescription created successfully.",
      data: {
        prescription: prescription[0],
        medicines: createdMedicines,
      },
    });
  } catch (error) {
    // Automatic abort if any error occurs
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    console.error("Prescription creation error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create prescription",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//Get full prescription by id
exports.getFullPrescription = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    // 1. Get prescription
    const prescription = await PrescriptionModel.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // 2. Get related medicines
    const medicines = await PrescriptionMedicineModel.find({
      prescription_id: prescriptionId,
    }).populate("patient_id"); // populate patient details if needed

    res.status(200).json({
      status: "success",
      message: "Prescription retrieved successfully",
      data: {
        prescription,
        medicines,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server error.",
      error: error.message,
    });
  }
};

exports.PrescriptionList = async (req, res) => {
  try {
    const { pageNo, perPage, searchKeyword } = req.params;
    const page = parseInt(pageNo, 10) || 1;
    const limit = parseInt(perPage, 10) || 10;
    const skip = (page - 1) * limit;

    let searchArray = [];

    if (searchKeyword && searchKeyword !== "0") {
      const searchRgx = { $regex: searchKeyword, $options: "i" };

      searchArray = [
        { "patient.name": searchRgx },
        { "patient.mobile_number": searchRgx },
        { "patient.patient_id": searchRgx },
        { "prescription.history": searchRgx },
        { "prescription.complaints": searchRgx },
        { "prescription.past_medical": searchRgx },
      ];
    }

    const pipeline = [
      // Step 1: Group by unique prescription_id to avoid duplicates
      {
        $group: {
          _id: "$prescription_id",
          patient_id: { $first: "$patient_id" }, // get the patient_id from first record
        },
      },
      // Step 2: Lookup patient details
      {
        $lookup: {
          from: "patients",
          localField: "patient_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: "$patient" },
      // Step 3: Lookup prescription details
      {
        $lookup: {
          from: "prescriptions",
          localField: "_id", // _id here is actually prescription_id
          foreignField: "_id",
          as: "prescription",
        },
      },
      { $unwind: "$prescription" },
      // Step 4: Apply search if needed
      ...(searchArray.length > 0 ? [{ $match: { $or: searchArray } }] : []),
      { $sort: { "prescription.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          prescription_id: "$_id",
          patient: {
            name: 1,
            mobile_number: 1,
            patient_id: 1,
          },
          prescription: {
            history: 1,
            complaints: 1,
            past_medical: 1,
            createdAt: 1,
          },
        },
      },
    ];

    const result = await PrescriptionMedicineModel.aggregate(pipeline);

    // Count total
    const totalPipeline = [
      {
        $group: {
          _id: "$prescription_id",
          patient_id: { $first: "$patient_id" },
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "patient_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: "$patient" },
      {
        $lookup: {
          from: "prescriptions",
          localField: "_id",
          foreignField: "_id",
          as: "prescription",
        },
      },
      { $unwind: "$prescription" },
      ...(searchArray.length > 0 ? [{ $match: { $or: searchArray } }] : []),
      { $count: "total" },
    ];

    const totalResult = await PrescriptionMedicineModel.aggregate(
      totalPipeline
    );
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    res.status(200).json({
      status: "success",
      data: result,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: error.message || error.toString(),
    });
  }
};
