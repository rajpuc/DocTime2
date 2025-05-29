const express = require("express");
const AuthVerification=require("../middlewares/AuthMiddleware");
const AuthController = require("../controllers/User/AuthController");
const MedicineController = require("../controllers/Medicine/MedicineController");
const PatientController = require("../controllers/Patient/PatientController");
const PrescriptionController = require("../controllers/Prescription/PrescriptionController");
const PrescriptionMedicineController = require("../controllers/Prescription/PrescriptionMedicineController");
const router = express.Router();

//Authentication Routes
router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);
router.get("/users",AuthVerification, AuthController.getAllUsers);
router.get("/user/:id",AuthVerification,AuthController.getUserById);
router.post("/update-user/:id",AuthVerification,AuthController.updateUser);
router.post("/remove-user/:id",AuthVerification,AuthController.deleteUser);

//Medicine Routes
router.post("/medicine",AuthVerification,MedicineController.createMedicine);
router.get("/medicines",AuthVerification,MedicineController.getAllMedicines);
router.get("/medicine/:id",AuthVerification,MedicineController.getMedicineById);
router.post("/update-medicine/:id",AuthVerification,MedicineController.updateMedicine);
router.post("/remove-medicine/:id",AuthVerification,MedicineController.deleteMedicine);

//Patient Routes
router.post("/patient",AuthVerification,PatientController.createPatient);
router.get("/patients",AuthVerification,PatientController.getAllPatients);
router.get("/patient/:id",AuthVerification,PatientController.getPatientById);
router.post("/update-patient/:id",AuthVerification,PatientController.updatePatient);
router.post("/remove-patient/:id",AuthVerification,PatientController.deletePatient);
router.get("/search-patients", PatientController.searchPatient);


//Prescription Routes
router.post("/prescription",AuthVerification,PrescriptionController.createPrescription);
router.get("/prescriptions",AuthVerification,PrescriptionController.getAllPrescriptions);
router.get("/prescription/:id",AuthVerification,PrescriptionController.getPrescriptionById);
router.post("/update-prescription/:id",AuthVerification,PrescriptionController.updatePrescription);
router.post("/remove-prescription/:id",AuthVerification,PrescriptionController.deletePrescriptionById);
router.post("/full-prescription",AuthVerification,PrescriptionController.createFullPrescription);
router.get("/full-prescription/:id",AuthVerification,PrescriptionController.getFullPrescription);
router.get("/prescription-list/:pageNo/:perPage/:searchKeyword",AuthVerification,PrescriptionController.PrescriptionList);

//Prescription Medicine Routes
router.post("/prescription-medicine",AuthVerification,PrescriptionMedicineController.createPrescriptionMedicine);
router.get("/prescription-medicines",AuthVerification,PrescriptionMedicineController.getAllPrescriptionMedicines);
router.get("/prescription-medicine/:id",AuthVerification,PrescriptionMedicineController.getPrescriptionMedicineById);
router.post("/update-prescription-medicine/:id",AuthVerification,PrescriptionMedicineController.updatePrescriptionMedicineById);
router.post("/remove-prescription-medicine/:id",AuthVerification,PrescriptionMedicineController.deletePrescriptionMedicineById);

module.exports = router;
