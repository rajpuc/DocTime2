import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  IsEmpty,
  IsMobile,
  ErrorToast,
  SuccessToast,
} from "../../Helper/FormHelper";
import { FaSpinner } from "react-icons/fa";
import { BaseURL } from "../../Helper/Config";
import { getToken } from "../../Helper/SessionHelper";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import Swal from "sweetalert2";
import { Form, FormControl, Button, Container, Spinner } from "react-bootstrap";

const CreatePatient = () => {
  const [searchBy, setSearchBy] = useState("name");
  const [searchPatientText, setSearchPatientText] = useState("");
  const [data, setData] = useState([]);
  const [filteredPatient, setFilteredPatient] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [searchLoader, setSearchLoader] = useState(false);
  const mobileRef = useRef();
  const nameRef = useRef();
  const weightRef = useRef();
  const ageRef = useRef();
  const hbsagRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const mobile = mobileRef.current.value;
    const name = nameRef.current.value;
    const weight = weightRef.current.value;
    const age = ageRef.current.value;
    const hbsag = hbsagRef.current.value;

    if (IsEmpty(name)) {
      ErrorToast("Valid Name Required");
    } else if (!IsMobile(mobile)) {
      ErrorToast("Valid Mobile Number Required");
    } else if (IsEmpty(weight)) {
      ErrorToast("Weight Required");
    } else if (IsEmpty(age)) {
      ErrorToast("Age Required");
    } else {
      try {
        dispatch(ShowLoader());
        let response;
        if (editPatient) {
          response = await axios.post(
            `${BaseURL}/update-patient/${editPatient._id}`,
            { mobile_number: mobile, name, weight, age, HBsAg: hbsag },
            { headers: { token: getToken() } }
          );
        } else {
          response = await axios.post(
            `${BaseURL}/patient`,
            { mobile_number: mobile, name, weight, age, HBsAg: hbsag },
            { headers: { token: getToken() } }
          );
        }

        if (response?.data?.status === "success") {
          SuccessToast(
            editPatient
              ? "Patient updated successfully"
              : "Patient added successfully"
          );

          mobileRef.current.value = "";
          nameRef.current.value = "";
          weightRef.current.value = "";
          ageRef.current.value = "";
          hbsagRef.current.value = "";

          setEditPatient(null);
          fetchData();
        } else {
          ErrorToast(response?.data?.message || "User Add failed.");
        }
      } catch (error) {
        ErrorToast(error.response?.data?.message || "Something went wrong.");
      } finally {
        dispatch(HideLoader());
      }
    }
  };

  const fetchData = async () => {
    try {
      let result = await axios.get(`${BaseURL}/patients`, {
        headers: { token: getToken() },
      });
      setData(result.data.data);
    } catch (error) {
      ErrorToast("No Users Found");
    }
  };

  const handleEdit = (patient) => {
    setEditPatient(patient);
  };

  const deleteService = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(ShowLoader());
        try {
          const response = await axios.post(
            `${BaseURL}/remove-patient/${id}`,
            {},
            {
              headers: { token: getToken() },
            }
          );

          if (response.data.status === "success") {
            SuccessToast(response.data.message);
            fetchData();
          } else {
            ErrorToast(response.data.message);
          }
        } catch (error) {
          ErrorToast(error.response?.data?.message || "An error occurred.");
        } finally {
          dispatch(HideLoader());
        }
      }
    });
  };

  // const handleFilter = (e) => {
  //   const value = e.target.value.trim();
  //   setSearchPatientText(value);

  //   if (!value) {
  //     setFilteredPatient([]);
  //     return;
  //   }

  //   const regex = new RegExp(value, "i");
  //   setFilteredPatient(
  //     data.filter((patient) =>
  //       regex.test(searchBy === "name" ? patient.name : patient.mobile_number)
  //     )
  //   );
  // };

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchPatientText.length > 0) {
        handleFilter();
      } else {
        setFilteredPatient([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchPatientText]);

  const handleFilter = async () => {
    if (!searchPatientText) {
      setFilteredPatient([]);
      return;
    }

    try {
      setSearchLoader(true);
      const response = await axios.get(
        `${BaseURL}/search-patients?keyword=${searchPatientText}`,
        { headers: { token: getToken() } }
      );

      if (response.data.status === "success") {
        setFilteredPatient(response.data.data);
      } else {
        setFilteredPatient([]);
        ErrorToast(response.data.message || "No matching patients found.");
      }
    } catch (error) {
      ErrorToast("Failed to fetch filtered patients.");
    } finally {
      setSearchLoader(false);
    }
  };

  // Update input fields manually when `editPatient` changes
  useEffect(() => {
    if (editPatient) {
      nameRef.current.value = editPatient.name || "";
      mobileRef.current.value = editPatient.mobile_number || "";
      weightRef.current.value = editPatient.weight || "";
      ageRef.current.value = editPatient.age || "";
      hbsagRef.current.value = editPatient.HBsAg || "";
    }
  }, [editPatient]);

  useEffect(() => {
    const load = async () => {
      dispatch(ShowLoader());
      await fetchData();
      dispatch(HideLoader());
    };
    load();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card animated fadeIn p-3">
            <div className="card-body">
              <h4 className="card-title">Add Patient</h4>
              <hr />
              <div className="container-fluid m-0 p-0">
                <div className="row m-0 p-0">
                  <div className="col-6">
                    <label>Name</label>
                    <input
                      ref={nameRef}
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                  </div>
                  <div className="col-6">
                    <label>Mobile Number</label>
                    <input
                      ref={mobileRef}
                      className="form-control animated fadeInUp"
                      type="tel"
                    />
                  </div>
                  <div className="col-6">
                    <label>Weight</label>
                    <input
                      ref={weightRef}
                      className="form-control animated fadeInUp"
                      type="number"
                    />
                  </div>
                  <div className="col-6">
                    <label>Age</label>
                    <input
                      ref={ageRef}
                      className="form-control animated fadeInUp"
                      type="number"
                    />
                  </div>
                  <div className="col-6">
                    <label>HBsAg</label>
                    <input
                      ref={hbsagRef}
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                  </div>
                </div>
                <div className="row mt-2 p-0">
                  <div className="p-2">
                    <button
                      onClick={handleSubmit}
                      className="btn w-100 btn-success animated fadeInUp"
                    >
                      {editPatient ? "Update Patient" : "Add Patient"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table to Display Patient */}
      <div className="mt-4">
        <h4 className="card-title">All Patients</h4>
        <div className="mt-2">
          <div className="row">
            <div className="d-flex col-6">
              <FormControl
                type="text"
                placeholder={`Search Patient here`}
                value={searchPatientText}
                onChange={(e) => setSearchPatientText(e.target.value)}
                className="me-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4 overflow-x-auto">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-success">
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Weight</th>
                  <th>Age</th>
                  <th>HBsAg</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchPatientText ? (
                  filteredPatient.length > 0 ? (
                    filteredPatient.map((item) => (
                      <tr key={item._id}>
                        <td>{item.patient_id}</td>
                        <td>{item.name}</td>
                        <td>{item.mobile_number}</td>
                        <td>{item.weight}</td>
                        <td>{item.age}</td>
                        <td>{item.HBsAg}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteService(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : searchLoader ? (
                    <tr>
                      <td
                        colSpan="100%"
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        <div
                          style={{ display: "inline-block", padding: "10px" }}
                        >
                          <Spinner style={{ backgroundColor: "transparent" }} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No Patient available
                      </td>
                    </tr>
                  )
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id}>
                      <td>{item.patient_id}</td>
                      <td>{item.name}</td>
                      <td>{item.mobile_number}</td>
                      <td>{item.weight}</td>
                      <td>{item.age}</td>
                      <td>{item.HBsAg}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteService(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No Patient available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;
