import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IsEmpty, ErrorToast, SuccessToast } from "../../Helper/FormHelper";
import { BaseURL } from "../../Helper/Config";
import { getToken } from "../../Helper/SessionHelper";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import Swal from "sweetalert2";
import { FormControl, Spinner } from "react-bootstrap";
import Select from "react-select";

const CreateMedicine = () => {
  const [data, setData] = useState([]);
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);
  const [searchText, setSearchText] = useState("");
  const nameRef = useRef();
  const groupIdRef = useRef();
  const scheduleRef = useRef();
  const [searchLoader, setSearchLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);


  const handleSubmit = async () => {
    const name = nameRef.current.value;
    const groupID = groupIdRef.current.value;
    const schedule = scheduleRef.current.value;

    if (IsEmpty(name)) {
      ErrorToast("Medicine Name Required");
    } else if (IsEmpty(groupID)) {
      ErrorToast("Group ID Required");
    } else if (IsEmpty(schedule)) {
      ErrorToast("Schedule Required");
    } else {
      try {
        dispatch(ShowLoader());
        let response;
        if (editMedicine) {
          response = await axios.post(
            `${BaseURL}/update-medicine/${editMedicine._id}`,
            { name, groupID, schedule },
            { headers: { token: getToken() } }
          );
        } else {
          response = await axios.post(
            `${BaseURL}/medicine`,
            { name, groupID, schedule },
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
          groupIdRef.current.value = "";

          setEditMedicine(null);
          fetchData();
        } else {
          ErrorToast(response?.data?.message || "Action failed.");
        }
      } catch (error) {
        if (error.status === 401) {
          removeSessions();
        }
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
      if (error.status === 401) {
        removeSessions();
      }
      ErrorToast("No Medicines Found");
    }
  };
  const fetchGroups = async () => {
    try {
      dispatch(ShowLoader());
      const response = await axios.get(`${BaseURL}/getAllGroup`, {
        headers: { token: getToken() },
      });
      setGroups(response.data.data || []);
    } catch (error) {
      if (error.status === 401) {
        removeSessions();
      }
    } finally {
      dispatch(HideLoader());
    }
  };




  useEffect(() => {
    const load = async () => {
      dispatch(ShowLoader());
      await fetchData();
      await fetchGroups();
      dispatch(HideLoader());
    };
    load();
  }, []);

  const groupOptions = groups.map((group) => ({
    value: group._id,
    label: `${group.name}`,
    ...group,
  }));

  const handleSelectGroup = (selectedOption) => {
    if (!selectedOption) return;

    groupIdRef.current.value=selectedOption._id;
  };


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
                  <div className="col-md-4">
                    <label>Select Group</label>
                    <Select
                      ref={groupIdRef}
                      options={groupOptions}
                      onChange={handleSelectGroup}
                      placeholder="Search and select a Doctor"
                      isClearable
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
        <h4 className="card-title">Medicine List</h4>
        <div className="table-responsive mt-2">
          <table className="table table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              { data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.schedule}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No Medicine available
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
