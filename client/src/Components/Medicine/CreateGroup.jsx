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

const CreateGroup = () => {
  const [data, setData] = useState([]);
  const nameRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const name = nameRef.current.value;
 

    if (IsEmpty(name)) {
      ErrorToast("Medicine Name Required");
    } else {
      try {
        dispatch(ShowLoader());
        let response = await axios.post(
          `${BaseURL}/CreateGroup`,
          { name },
          { headers: { token: getToken() } }
        );
        

        if (response?.data?.status === "success") {
          SuccessToast(
             "Group name added successfully"
          );

          nameRef.current.value = "";
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
      let result = await axios.get(`${BaseURL}/getAllGroup`, {
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
              <h4 className="card-title">Add Group</h4>
              <hr />
              <div className="container-fluid">
                <div className="row">
                  <div className="col-6">
                    <label>Group Name</label>
                    <input
                      ref={nameRef}
                      className="form-control"
                      type="text"
                    />
                  </div>

                </div>
                <div className="row mt-2">
                  <div className="p-2 col-3">
                    <button
                      onClick={handleSubmit}
                      className="btn w-100 btn-success"
                    >
                      Add Group
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="card-title">Group List</h4>

        <div className="table-responsive mt-2">
          <table className="table table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>Group Name</th>
              </tr>
            </thead>
            <tbody>
              {
              data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No Group Name available
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

export default CreateGroup;

