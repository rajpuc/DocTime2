import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { BaseURL } from "../../Helper/Config";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import { getToken, removeSessions } from "../../Helper/SessionHelper";
import ReactPaginate from "react-paginate";
import { ErrorToast, SuccessToast } from "../../Helper/FormHelper";
import { MdPrint } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PatientList = () => {
  const dispatch = useDispatch();
  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("0");
  const [perPage, setPerPage] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(1, perPage, searchKeyword);
  }, [searchKeyword, perPage]);

  const fetchData = async (page = 1, perPage = 20, keyword = "0") => {
    try {
      dispatch(ShowLoader());
      const response = await axios.get(
        `${BaseURL}/getAllPatients/${page}/${perPage}/${keyword}`,
        { headers: { token: getToken() } }
      );

      setPatients(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      if (err.status === 401) {
        removeSessions();
      }
      Swal.fire("Error", "Failed to load Prescription list.", "error");
    } finally {
      dispatch(HideLoader());
    }
  };

  const handlePageClick = async (event) => {
    await fetchData(event.selected + 1, perPage, searchKeyword);
  };

  const perPageOnChange = async (e) => {
    const value = parseInt(e.target.value);
    setPerPage(value);
    await fetchData(1, value, searchKeyword);
  };

  return (
    <Fragment>
      <div className="container-fluid my-5">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 col-lg-3">
                      <h5>Patient List</h5>
                    </div>
                    <div className="col-12 col-lg-3">
                      <input
                        onKeyUp={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Text Filter"
                        className="form-control form-control-sm"
                      />
                    </div>
                    <div className="col-12 col-lg-3">
                      <select
                        onChange={perPageOnChange}
                        className="form-control form-select-sm"
                      >
                        <option value="20">20 Per Page</option>
                        <option value="30">30 Per Page</option>
                        <option value="50">50 Per Page</option>
                        <option value="100">100 Per Page</option>
                        <option value="200">200 Per Page</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="sticky-top">
                            <tr className="table-active">
                              <th>Patient ID</th>
                              <th>Name</th>
                              <th>Mobile</th>
                              <th>Weight</th>
                              <th>Age</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patients.map((patient) => (
                              <tr key={patient._id}>
                                <td>{patient?.ID}</td>
                                <td>{patient?.name}</td>
                                <td>{patient?.mobile}</td>
                                <td>{patient?.weight}</td>
                                <td>{patient?.age}</td>
                                <td>
                                  {patient?.CreatedDate.split("T")[0]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <nav aria-label="Page navigation">
                      <ReactPaginate
                        previousLabel="<"
                        nextLabel=">"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        pageCount={Math.ceil(total / perPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName="pagination"
                        activeClassName="active"
                      />
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PatientList;
