import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IsEmpty, ErrorToast, SuccessToast } from "../../Helper/FormHelper";
import { BaseURL } from "../../Helper/Config";
import { getToken } from "../../Helper/SessionHelper";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import Swal from "sweetalert2";
import { FormControl } from "react-bootstrap";

const CreateMedicine = () => {
  const [data, setData] = useState([]);
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);
  const [searchText, setSearchText] = useState("");
  const nameRef = useRef();
  const groupNameRef = useRef();
  const scheduleRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const name = nameRef.current.value;
    const group_name = groupNameRef.current.value;
    const schedule = scheduleRef.current.value;

    if (IsEmpty(name)) {
      ErrorToast("Medicine Name Required");
    } else if (IsEmpty(group_name)) {
      ErrorToast("Dose Required");
    } else if (IsEmpty(schedule)) {
      ErrorToast("Dose Required");
    } else {
      try {
        dispatch(ShowLoader());
        let response;
        if (editMedicine) {
          response = await axios.post(
            `${BaseURL}/update-medicine/${editMedicine._id}`,
            { name, group_name,schedule },
            { headers: { token: getToken() } }
          );
        } else {
          response = await axios.post(
            `${BaseURL}/medicine`,
            { name, group_name, schedule },
            { headers: { token: getToken() } }
          );
        }

        if (response?.data?.status === "success") {
          SuccessToast(
            editMedicine
              ? "Medicine updated successfully"
              : "Medicine added successfully"
          );

          nameRef.current.value = "";
          scheduleRef.current.value = "";
          groupNameRef.current.value = "";

          setEditMedicine(null);
          fetchData();
        } else {
          ErrorToast(response?.data?.message || "Action failed.");
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
      let result = await axios.get(`${BaseURL}/medicines`, {
        headers: { token: getToken() },
      });
      setData(result.data.data);
    } catch (error) {
      ErrorToast("No Medicines Found");
    }
  };

  const handleEdit = (medicine) => {
    setEditMedicine(medicine);
  };

  const deleteMedicine = async (id) => {
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
            `${BaseURL}/remove-medicine/${id}`,
            {},
            { headers: { token: getToken() } }
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

  const handleFilter = (e) => {
    const value = e.target.value.trim();
    setSearchText(value);

    if (!value) {
      setFilteredMedicine([]);
      return;
    }

    const regex = new RegExp(value, "i");
    setFilteredMedicine(data.filter((med) => regex.test(med.name)));
  };

  useEffect(() => {
    if (editMedicine) {
      nameRef.current.value = editMedicine.name || "";
      groupNameRef.current.value = editMedicine.group_name || "";
      scheduleRef.current.value = editMedicine.schedule || "";
    }
  }, [editMedicine]);

  useEffect(() => {
    dispatch(ShowLoader());
    fetchData();
    dispatch(HideLoader());
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card animated fadeIn p-3">
            <div className="card-body">
              <h4 className="card-title">Add Medicine</h4>
              <hr />
              <div className="container-fluid">
                <div className="row">
                  <div className="col-4">
                    <label>Name</label>
                    <input ref={nameRef} className="form-control" type="text" />
                  </div>
                  <div className="col-4">
                    <label>Group Name</label>
                    <input
                      ref={groupNameRef}
                      className="form-control"
                      type="text"
                    />
                  </div>
                  <div className="col-4">
                    <label>Schedule</label>
                    <input
                      ref={scheduleRef}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="p-2">
                    <button
                      onClick={handleSubmit}
                      className="btn w-100 btn-success"
                    >
                      {editMedicine ? "Update Medicine" : "Add Medicine"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="card-title">All Medicines</h4>

        <div className="row my-2">
          <div className="d-flex col-6">
            <FormControl
              type="text"
              placeholder={`Search by Name`}
              value={searchText}
              onChange={handleFilter}
              className="me-2"
            />
          </div>
        </div>

        <div className="table-responsive mt-2">
          <table className="table table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Group Name</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(searchText ? filteredMedicine : data).length > 0 ? (
                (searchText ? filteredMedicine : data).map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.group_name}</td>
                    <td>{item.schedule}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMedicine(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Medicines Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateMedicine;
