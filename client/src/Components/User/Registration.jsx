import React, { Fragment, useRef } from "react";
import { ErrorToast, SuccessToast, IsEmpty } from "../../Helper/FormHelper";
import { BaseURL } from "../../Helper/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const mobileRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleRegistration = async () => {
    const mobile = mobileRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;

    if (IsEmpty(mobile)) {
      ErrorToast("Mobile Required");
    } else if (IsEmpty(name)) {
      ErrorToast("Name Required");
    } else if (IsEmpty(password)) {
      ErrorToast("Password Required");
    } else {
      try {
        const res = await axios.post(`${BaseURL}/signup`, {
          mobile,
          name,
          password,
        });

        if (res.data.status === "success") {
          SuccessToast(res.data.message || "Please Login");
          navigate("/");
        } else {
          ErrorToast(res.data.message || "Registration Failed");
        }
      } catch (error) {
        ErrorToast(error.response?.data?.message || "Something went wrong.");
      }
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row  justify-content-center mt-5">
          <div className="col-md-6 col-12 col-sm-8 col-lg-6 center-screen mt-5">
            <div className="card w-100 p-4">
              <div className="card-body">
                <h4>Registration</h4>
                <br />
                <label>Name</label>
                <input
                  ref={nameRef}
                  placeholder="Name"
                  className="form-control animated fadeInUp"
                  type="text"
                />
                <br />
                <label>Your Mobile</label>
                <input
                  ref={mobileRef}
                  placeholder="User Mobile"
                  className="form-control animated fadeInUp"
                  type="Number"
                />
                <br />
                <label>Password</label>
                <input
                  ref={passwordRef}
                  placeholder="Password"
                  className="form-control animated fadeInUp"
                  type="password"
                />
                <br />
                <button
                  onClick={handleRegistration}
                  className="btn w-100 animated fadeInUp float-end btn-primary"
                >
                  Registration
                </button>
                <br />
                <div className="mt-4">
                  <Link to="/Login">
                    <button
                      className="btn w-100 fw-bold"
                      style={{
                        background: "none",
                        border: "2px solid rgb(71, 236, 56)",
                        color: "rgb(71, 236, 56)",
                      }}
                    >
                     Login
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Registration;
