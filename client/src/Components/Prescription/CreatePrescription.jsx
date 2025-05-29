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
} from "react-bootstrap";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { getToken } from "../../Helper/SessionHelper";
import { useDispatch } from "react-redux";
import {
  IsEmpty,
  IsMobile,
  ErrorToast,
  SuccessToast,
} from "../../Helper/FormHelper";
import { BaseURL } from "../../Helper/Config";
import { useNavigate } from "react-router-dom";

const CreatePrescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [prescriptionData, setPrescriptionData] = useState({
    patient_id: "",
    history: "",
    complaints: "",
    obsteric: "",
    menstrual: "",
    vaccine: "",
    past_medical: "",
    past_surgical: "",
    family_social: "",
    contraceptive: "",
    drug: "",
    examination: "",
    general: "",
    obsterical: "",
    abdominal: "",
    pelvic: "",
    investigation: "",
    provisional_dx: "",
    special_note: "",
    medicines: [],
  });


  // ---start search & select patient logic
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryValidation, setSearchQueryValidation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) {
        fetchPatients(searchQuery);
      } else {
        setSearchResults([]);
        setSearchPerformed(false); // Reset
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchPatients = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BaseURL}/search-patients?keyword=${query}`
      );
      setSearchResults(data?.data || []);
      setSearchPerformed(true); // <-- Mark that a search was made
    } catch (error) {
      console.error("Patient search error", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setPrescriptionData((prev) => ({
      ...prev,
      patient_id: patient._id,
    }));
    const displayText = `ID: ${patient.patient_id} - Name: ${patient.name} - Mobile: ${patient.mobile_number}`;
    setSearchQuery(displayText);
    setSearchQueryValidation(displayText);
    setSearchResults([]);
    setSearchPerformed(false); // reset after selecting
  };

  // ---end search & select patient logic

  const [medicineDetails, setMedicineDetails] = useState({
    medicine_name: "",
    schedule: "",
  });

  const updateFormData = (e) => {
    setPrescriptionData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateMedicineData = (e) => {
    setMedicineDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addMedicineHandler = (e) => {
    e.preventDefault();
    if (IsEmpty(medicineDetails.medicine_name)) {
      ErrorToast("Valid medicine name reqired");
      return;
    } else if (IsEmpty(medicineDetails.schedule)) {
      ErrorToast("Medicine schedule can't be empty.");
      return;
    }
    // setMedicines((prev) => [...prev, medicineDetails]);
    setPrescriptionData((prev) => ({
      ...prev,
      medicines:[...prev.medicines,medicineDetails],
    }));
    setMedicineDetails({
      medicine_name: "",
      schedule: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (IsEmpty(prescriptionData.patient_id)) {
      ErrorToast("Please Select a Patient");
      return;
    }
    if (searchQuery !== searchQueryValidation) {
      ErrorToast("Please Select a Patient Again");
      setSearchQuery("");
      return;
    }

    if (IsEmpty(prescriptionData.medicines)) {
      ErrorToast("Please Add Medicines");
      return;
    }

    try {
      dispatch(ShowLoader());
      const response = await axios.post(
        `${BaseURL}/full-prescription`,
        prescriptionData,
        { headers: { token: getToken() } }
      );

      if (response?.data?.status === "success") {
        SuccessToast(response.data.message);
        setSearchQuery("");
        setSearchQueryValidation("");
        setPrescriptionData({
          patient_id: "",
          history: "",
          complaints: "",
          obsteric: "",
          menstrual: "",
          vaccine: "",
          past_medical: "",
          past_surgical: "",
          family_social: "",
          contraceptive: "",
          drug: "",
          examination: "",
          general: "",
          obsterical: "",
          abdominal: "",
          pelvic: "",
          investigation: "",
          provisional_dx: "",
          special_note: "",
          medicines: [],
        });

        navigate(`/Print/${response?.data?.data?.prescription._id}`);
      } else {
        ErrorToast(
          response?.data?.message ||
            "Unable to create prescription. Please try again"
        );
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Something went wrong.");
    } finally {
      dispatch(HideLoader());
    }
  };

  return (
    <Container fluid className="p-4">
      <Form onSubmit={handleSubmit}>
        <Row className=" bg-prescription py-3">
          <Col md={8}>
            <Form.Label>Select Patient</Form.Label>
            <InputGroup className="w-100 position-relative">
              <FormControl
                className="cust-form-control"
                type="text"
                placeholder="You can search by patient name, phone number, or patient ID."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => setSearchInputFocused(true)}
                onBlur={(e) => setSearchInputFocused(false)}
              />
              {loading && (
                <InputGroup.Text>
                  <FaSpinner className="spin" />
                </InputGroup.Text>
              )}

              {searchResults.length > 0 ? (
                <ListGroup className="position-absolute top-1001 w-100">
                  {searchResults.map((patient) => (
                    <ListGroup.Item
                      key={patient._id}
                      action
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <strong>Patient ID:</strong> {patient.patient_id} -&nbsp;
                      <strong>Name:</strong> {patient.name} -&nbsp;
                      <strong>Mobile:</strong> {patient.mobile_number}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                searchPerformed &&
                searchInputFocused &&
                !loading && (
                  <ListGroup className="position-absolute top-1001 w-100">
                    <ListGroup.Item className="text-center">
                      No Patient Found
                    </ListGroup.Item>
                  </ListGroup>
                )
              )}
            </InputGroup>
          </Col>
        </Row>
        <Row>
          {/* Left Column */}
          <Col md={4} className="bg-prescription">
            {/* Patient Info */}
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="history">
                  <Form.Label>History</Form.Label>
                  <Form.Control
                    type="text"
                    value={prescriptionData.history}
                    name="history"
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
                    value={prescriptionData.complaints}
                    name="complaints"
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
                    value={prescriptionData.obsteric}
                    name="obsteric"
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
                    value={prescriptionData.menstrual}
                    name="menstrual"
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
                    value={prescriptionData.vaccine}
                    name="vaccine"
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
                    value={prescriptionData.past_medical}
                    name="past_medical"
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
                    value={prescriptionData.past_surgical}
                    name="past_surgical"
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
                    value={prescriptionData.family_social}
                    name="family_social"
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
                    value={prescriptionData.contraceptive}
                    name="contraceptive"
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
                    value={prescriptionData.drug}
                    name="drug"
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
                    value={prescriptionData.examination}
                    name="examination"
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
                    value={prescriptionData.general}
                    name="general"
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
                    value={prescriptionData.obsterical}
                    name="obsterical"
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
                    value={prescriptionData.abdominal}
                    name="abdominal"
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
                    value={prescriptionData.pelvic}
                    name="pelvic"
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
                    value={prescriptionData.investigation}
                    name="investigation"
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
                    value={prescriptionData.provisional_dx}
                    name="provisional_dx"
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
                    value={prescriptionData.special_note}
                    name="special_note"
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
                {prescriptionData.medicines.length > 0 && (
                  <>
                    <h4 className="mb-3">Prescribed Medicines</h4>
                    <ul>
                      {prescriptionData.medicines.map((med, idx) => (
                        <li key={idx} className="ml-2">
                          <div className="">
                            <h4 className="">{med.medicine_name}</h4>
                            <div className="text-muted fs-5">
                              {med.schedule}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <h4>Add Medicine</h4>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="medicine_name">
                      <Form.Label>Medicine Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={medicineDetails.medicine_name}
                        name="medicine_name"
                        onChange={updateMedicineData}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="schedule">
                      <Form.Label>Schedule</Form.Label>
                      <Form.Control
                        type="text"
                        value={medicineDetails.schedule}
                        name="schedule"
                        onChange={updateMedicineData}
                      />
                    </Form.Group>
                  </Col>
                  <Row>
                    <Col md={3} className="p-2">
                      <button
                        onClick={addMedicineHandler}
                        style={{
                          whiteSpace: "nowrap",
                        }}
                        className="btn w-100 btn-success  animated fadeInUp"
                      >
                        Add Medicine
                      </button>
                    </Col>
                  </Row>
                </Row>
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
    </Container>
  );
};

export default CreatePrescription;
