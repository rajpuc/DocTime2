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
  const mobileRef = useRef();
  const nameRef = useRef();
  const weightRef = useRef();
  const ageRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const mobile = mobileRef.current.value;
    const name = nameRef.current.value;
    const weight = weightRef.current.value;
    const age = ageRef.current.value;

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
        const response = await axios.post(
          `${BaseURL}/createPatient`,
          { mobile, name, weight, age },
          { headers: { token: getToken() } }
        );

        SuccessToast("Patient added successfully");
        mobileRef.current.value = "";
        nameRef.current.value = "";
        weightRef.current.value = "";
        ageRef.current.value = "";
      } catch (error) {
        ErrorToast(error.response?.data?.message || "Something went wrong.");
      } finally {
        dispatch(HideLoader());
      }
    }
  };

  const fetchData = async (page = 1, perPage = 20, keyword = "0") => {
    try {
      dispatch(ShowLoader());
      const response = await axios.get(
        `${BaseURL}/getAllPatients/${page}/${perPage}/${keyword}`,
        { headers: { token: getToken() } }
      );
    } catch (err) {
      if (err.status === 401) {
        removeSessions();
        ErrorToast("Please LogIn.");
      }
    } finally {
      dispatch(HideLoader());
    }
  };
  
  useEffect(() => {
    const load = async () => {
      await fetchData();
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
                </div>
                <div className="row mt-2 p-0">
                  <div className="p-2">
                    <button
                      onClick={handleSubmit}
                      className="btn w-100 btn-success animated fadeInUp"
                    >
                      Add Patient
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;
