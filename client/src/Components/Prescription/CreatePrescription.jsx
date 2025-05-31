import React, { useEffect } from "react";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Spinner,
  ListGroup,
  Button,
  Modal,
} from "react-bootstrap";

import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { getToken, removeSessions } from "../../Helper/SessionHelper";
import { useDispatch } from "react-redux";
import {
  IsEmpty,
  IsMobile,
  ErrorToast,
  SuccessToast,
} from "../../Helper/FormHelper";
import { BaseURL } from "../../Helper/Config";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CreatePrescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fetchedMedicineData, setFetchedMedicineData] = useState([]);

  const [prescriptionData, setPrescriptionData] = useState({
    Prescription: {
      patientID: "",
      ID: "",
      name: "",
      mobile: "",
      weight: "",
      HBsAg: "",
      history: "",
      complaints: "",
      obsteric: "",
      menstrual: "",
      vaccine: "",
      past_medical: "",
      past_surgical: "",
      family_social: "",
      drug: "",
      examination: "",
      general: "",
      obsterical: "",
      abdominal: "",
      pelvic: "",
      investigation: "",
      provisional_dx: "",
      special_note: "",
    },
    Medicine: [],
  });

  // Select Patient Logic
  const [searchKeyword, setSearchKeyword] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatientsData = async (page = 1, perPage = 10, keyword = "0") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BaseURL}/getAllPatients/${page}/${perPage}/${keyword}`,
        {
          headers: {
            token: getToken(),
          },
        }
      );
      const options = response.data.data.map((patient) => ({
        value: patient._id,
        label: `${patient.name} (${patient.mobile})`,
        ...patient,
      }));
      setPatients(options);
    } catch (err) {
      Swal.fire("Error", "Failed to load patients list.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on search keyword change
  useEffect(() => {
    const keyword = searchKeyword.trim() || "0";
    fetchPatientsData(1, 10, keyword);
  }, [searchKeyword]);

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSearchKeyword(inputValue);
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedPatient(selectedOption);
    setPrescriptionData((prev) => ({
      ...prev,
      Prescription: {
        ...prev.Prescription,
        patientID: selectedOption._id,
        ID: selectedOption.ID,
        name: selectedOption.name,
        mobile: selectedOption.mobile,
        weight: selectedOption.weight,
      },
    }));
  };

  //Select Patient logic End

  const fetchPrescriptionDetailsByID = async () => {
    if (!selectedPatient?._id) return;

    try {
      const response = await axios.get(
        `${BaseURL}/getPrescriptionByPatientID/${selectedPatient._id}`,
        {
          headers: { token: getToken() },
        }
      );

      const data = response?.data?.data;

      setPrescriptionData((prev) => ({
        Prescription: {
          patientID: data?.prescription?.patientID || "",
          ID: data?.prescription?.ID || "",
          name: data?.prescription?.name || "",
          mobile: data?.prescription?.mobile || "",
          weight: data?.prescription?.weight || "",
          HBsAg: data?.prescription?.HBsAg || "",
          history: data?.prescription?.history || "",
          complaints: data?.prescription?.complaints || "",
          obsteric: data?.prescription?.obsteric || "",
          menstrual: data?.prescription?.menstrual || "",
          vaccine: data?.prescription?.vaccine || "",
          past_medical: data?.prescription?.past_medical || "",
          past_surgical: data?.prescription?.past_surgical || "",
          family_social: data?.prescription?.family_social || "",
          drug: data?.prescription?.drug || "",
          examination: data?.prescription?.examination || "",
          general: data?.prescription?.general || "",
          obsterical: data?.prescription?.obsterical || "",
          abdominal: data?.prescription?.abdominal || "",
          pelvic: data?.prescription?.pelvic || "",
          investigation: data?.prescription?.investigation || "",
          provisional_dx: data?.prescription?.provisional_dx || "",
          special_note: data?.prescription?.special_note || "",
        },
        Medicine: (data?.medicines || []).map((med) => ({
          MedicineID: med._id,
          name: med.name,
          schedule: med.schedule,
        })),
      }));
    } catch (error) {
      if (error.status === 404) {
        setPrescriptionData((prev) => ({
          ...prev,
          Prescription: {
            ...prev.Prescription,
            HBsAg: "",
            history: "",
            complaints: "",
            obsteric: "",
            menstrual: "",
            vaccine: "",
            past_medical: "",
            past_surgical: "",
            family_social: "",
            drug: "",
            examination: "",
            general: "",
            obsterical: "",
            abdominal: "",
            pelvic: "",
            investigation: "",
            provisional_dx: "",
            special_note: "",
          },
        }));
      }
    }
  };

  const updateFormData = (e) => {
    const { name, value } = e.target;

    const [section, field] = name.split(".");

    if (section === "Prescription") {
      setPrescriptionData((prev) => ({
        ...prev,
        Prescription: {
          ...prev.Prescription,
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (IsEmpty(prescriptionData.Prescription.patientID)) {
      ErrorToast("Please Select a Patient");
      return;
    }
    if (IsEmpty(prescriptionData.Medicine)) {
      ErrorToast("Please Add Medicines");
      return;
    }

    try {
      dispatch(ShowLoader());
      const response = await axios.post(
        `${BaseURL}/createPrescription`,
        prescriptionData,
        { headers: { token: getToken() } }
      );

      if (response?.data?.status === "Success") {
        SuccessToast(response.data.message);
        setPrescriptionData({
          Prescription: {
            patientID: "",
            ID: "",
            name: "",
            mobile: "",
            weight: "",
            HBsAg: "",
            history: "",
            complaints: "",
            obsteric: "",
            menstrual: "",
            vaccine: "",
            past_medical: "",
            past_surgical: "",
            family_social: "",
            drug: "drug",
            examination: "",
            general: "",
            obsterical: "",
            abdominal: "",
            pelvic: "",
            investigation: "",
            provisional_dx: "",
            special_note: "",
          },
          Medicine: [],
        });
        setSelectedPatient(null);

        navigate(`/Print/${response?.data?.id}`);
      } else {
        ErrorToast(
          response?.data?.message ||
            "Unable to create prescription. Please try again"
        );
      }
    } catch (error) {
      if (error.status === 401) {
        removeSessions();
      }
      ErrorToast(error.response?.data?.message || "Something went wrong.");
    } finally {
      dispatch(HideLoader());
    }
  };

  const fetchMedicines = async () => {
    try {
      dispatch(ShowLoader());
      const response = await axios.get(`${BaseURL}/medicines`, {
        headers: { token: getToken() },
      });
      setFetchedMedicineData(response.data.data || []);
    } catch (error) {
      if (error.status === 401) {
        removeSessions();
      }
      ErrorToast("Failed to load tests");
    } finally {
      dispatch(HideLoader());
    }
  };

  const medicineOptions = fetchedMedicineData.map((test) => ({
    value: test,
    label: `${test.name}`,
    ...test,
  }));

  const handleSelectMedicine = (selectedOption) => {
    if (!selectedOption) return;

    const test = selectedOption;

    if (
      prescriptionData.Medicine.some((item) => item.MedicineID === test._id)
    ) {
      ErrorToast("Medicine already selected");
      return;
    }

    setPrescriptionData((prev) => ({
      ...prev,
      Medicine: [
        ...prev.Medicine,
        {
          MedicineID: test._id,
          name: test.name,
          schedule: test.schedule,
        },
      ],
    }));
  };

  const removeMedicineById = (medicineId) => {
    setPrescriptionData((prev) => ({
      ...prev,
      Medicine: prev.Medicine.filter((item) => item.MedicineID !== medicineId),
    }));
  };

  useEffect(() => {
    const load = async () => {
      await fetchMedicines();
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchPrescriptionDetailsByID();
    };
    load();
  }, [selectedPatient]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: "black",
      width: "100%", // or fixed like '300px'
      minHeight: "38px",
      borderColor: "#ced4da",
      boxShadow: "none",
    }),
    input: (provided) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isFocused ? "#e9ecef" : "white",
    }),
  };

  //modal
  const [newPatient, setNewPatient] = useState({
    name: "",
    mobile: "",
    weight: "",
    age: "",
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChangePatient = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPatient = async () => {
    const { name, mobile, weight, age } = newPatient;
    if (IsEmpty(name)) {
      ErrorToast("Please enter a valid name.");
      return;
    } else if (IsEmpty(mobile)) {
      ErrorToast("Please enter a valid mobile number.");
      return;
    } else if (IsEmpty(age)) {
      ErrorToast("Please enter age");
      return;
    } else if (IsEmpty(weight)) {
      ErrorToast("Please Enter weight.");
      return;
    }
    try {
      dispatch(ShowLoader());

      const response = await axios.post(
        `${BaseURL}/createPatient`,
        { name, mobile, weight, age },
        {
          headers: { token: getToken() },
        }
      );

      // Format the new patient to match Select component's expected format
      const newPatientOption = {
        value: response.data.patient._id,
        label: `${response.data.patient.name} (${response.data.patient.mobile})`,
        ...response.data.patient,
      };

      // Add the new patient to the patients list
      setPatients((prev) => [...prev, newPatientOption]);

      // Set the formatted patient as selected
      setSelectedPatient(newPatientOption);

      // Update prescription data with the new patient
      setPrescriptionData((prev) => ({
        ...prev,
        Prescription: {
          ...prev.Prescription,
          patientID: response.data.patient._id,
          ID: response.data.patient.ID,
          name: response.data.patient.name,
          mobile: response.data.patient.mobile,
          weight: response.data.patient.weight,
        },
      }));

      SuccessToast(response.data.message);
      setNewPatient({ name: "", mobile: "", weight: "", age: "" });
      handleClose();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.error("Error creating patient:", error);
    } finally {
      dispatch(HideLoader());
    }
  };

  return (
    <Container fluid className="p-4">
      <Form onSubmit={handleSubmit}>
        <Row className="bg-prescription py-3 align-items-end">
          <Col md={6}>
            <Form.Label>Select Patient</Form.Label>
            <Select
              styles={customStyles}
              options={patients}
              isLoading={loading}
              onInputChange={handleInputChange}
              onChange={handleChange}
              value={selectedPatient}
              placeholder="Type patient name or mobile..."
              noOptionsMessage={() =>
                loading ? "Searching..." : "No patients found"
              }
            />
          </Col>

          <Col md={6} className="d-flex justify-content-end">
            <Button variant="success" onClick={handleShow}>
              Add Patient
            </Button>
          </Col>
        </Row>
        <Row>
          {/* Left Column */}
          <Col md={4} className="bg-prescription">
            {/* Patient Info */}
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="hbsag">
                  <Form.Label>HbsAg</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.HBsAg}
                    name="Prescription.HBsAg"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="history">
                  <Form.Label>History</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.history}
                    name="Prescription.history"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="complaints">
                  <Form.Label>Complaints</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.complaints}
                    name="Prescription.complaints"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="obsteric">
                  <Form.Label>Obsteric</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.obsteric}
                    name="Prescription.obsteric"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="menstrual">
                  <Form.Label>Menstrual</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.menstrual}
                    name="Prescription.menstrual"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="vaccine">
                  <Form.Label>Vaccine</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.vaccine}
                    name="Prescription.vaccine"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="past_medical">
                  <Form.Label>Past Medical</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.past_medical}
                    name="Prescription.past_medical"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="past_surgical">
                  <Form.Label>Past Surgical</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.past_surgical}
                    name="Prescription.past_surgical"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="family_social">
                  <Form.Label>Family Social</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.family_social}
                    name="Prescription.family_social"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="contraceptive">
                  <Form.Label>Contraceptive</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.contraceptive}
                    name="Prescription.contraceptive"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="drug">
                  <Form.Label>Drug</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.drug}
                    name="Prescription.drug"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="examination">
                  <Form.Label>Examination</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.examination}
                    name="Prescription.examination"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="general">
                  <Form.Label>General</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.general}
                    name="Prescription.general"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="obsterical">
                  <Form.Label>Obsterical</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.obsterical}
                    name="Prescription.obsterical"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="abdominal">
                  <Form.Label>Abdominal</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.abdominal}
                    name="Prescription.abdominal"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="pelvic">
                  <Form.Label>Pelvic</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.pelvic}
                    name="Prescription.pelvic"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="investigation">
                  <Form.Label>Investigation</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.investigation}
                    name="Prescription.investigation"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="provisional_dx">
                  <Form.Label>Provisional Dx</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.provisional_dx}
                    name="Prescription.provisional_dx"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="special_note">
                  <Form.Label>Special Note</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData?.Prescription?.special_note}
                    name="Prescription.special_note"
                    onChange={updateFormData}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
          {/* Right Column */}
          <Col md={8}>
            <Row className="mb-3">
              <Col>
                <h4>Add Medicine</h4>
                {/* Search and Select Test Input */}
                <Select
                  options={medicineOptions}
                  onChange={handleSelectMedicine}
                  placeholder="Search and select a test"
                  isClearable
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <h4>Prescribed Medicines</h4>
                <table className="table-sm text-center table table-bordered ">
                  <thead className="table-success">
                    <tr>
                      <th>Name</th>
                      <th>Schedule</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptionData?.Medicine?.map((test) => (
                      <tr key={test._id}>
                        <td>{test.name}</td>
                        <td>{test.schedule}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeMedicineById(test.MedicineID)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <div className="row mt-2 p-0">
            <div className="p-2">
              <button
                type="submit"
                className="btn w-100 btn-success animated fadeInUp"
              >
                Create Prescription
              </button>
            </div>
          </div>
        </Row>
      </Form>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="patient-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="patient-modal-title">Add Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="patientName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient name"
                name="name"
                value={newPatient.name}
                onChange={handleChangePatient}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="patientMobile">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter mobile number"
                name="mobile"
                value={newPatient.mobile}
                onChange={handleChangePatient}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="patientWeight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter weight"
                name="weight"
                value={newPatient.weight}
                onChange={handleChangePatient}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="patientAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                name="age"
                value={newPatient.age}
                onChange={handleChangePatient}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={createPatient}>
            Create Patient
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreatePrescription;
