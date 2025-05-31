import React, { useRef, useState } from "react";
import { ErrorToast, SuccessToast, IsEmpty } from "../../Helper/FormHelper";
import { BaseURL } from "../../Helper/Config";
import { Link, useNavigate } from "react-router-dom";
import { setMobile, setName, setToken, setUserDetails} from "../../Helper/SessionHelper";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const mobileRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const mobile = mobileRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (IsEmpty(mobile)) {
      ErrorToast("Mobile number is required");
      return;
    }
    if (IsEmpty(password)) {
      ErrorToast("Password is required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BaseURL}/signin`, { mobile, password });

      const { data } = res;
      if (data.status === "success") {
        setToken(document.cookie);
        setUserDetails(data.data);
        setMobile(mobile);
        setName(data.data.name);
        SuccessToast(data.message || "Login Successful.");
        window.location.href = "/";
      } else {
        ErrorToast(data.message || "Login Failed.");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      ErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #ff7e5f, #6b6ce9)",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h3 className="fw-bold text-primary">Login</h3>
        <p className="text-muted">Welcome back! Please enter your details.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Your Mobile</label>
            <input
              ref={mobileRef}
              placeholder="Enter Mobile"
              className="form-control"
              type="text"
              disabled={loading}
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Password</label>
            <input
              ref={passwordRef}
              placeholder="Enter Password"
              className="form-control"
              type="password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 text-white fw-bold"
            style={{
              background: loading
                ? "gray"
                : "linear-gradient(45deg, #28a745, #218838)",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4">
          {/* <Link to="/Registration">
            <button
              className="btn w-100 fw-bold"
              style={{
                background: "none",
                border: "2px solid #dc3545",
                color: "#dc3545",
              }}
            >
              Registration
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
