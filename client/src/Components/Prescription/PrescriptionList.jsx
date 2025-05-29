import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { BaseURL } from "../../Helper/Config";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import { getToken } from "../../Helper/SessionHelper";
import ReactPaginate from "react-paginate";
import { ErrorToast, SuccessToast } from "../../Helper/FormHelper";
import { MdPrint } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrescriptionList = () => {
  const dispatch = useDispatch();
  const [prescriptions, setPrescriptions] = useState([]);
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
        `${BaseURL}/prescription-list/${page}/${perPage}/${keyword}`,
        { headers: { token: getToken() } }
      );
      setPrescriptions(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      Swal.fire("Error", "Failed to load Invoice list.", "error");
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
          const response = await axios.post(`${BaseURL}/remove-prescription/${id}`,{}, {
            headers: { token: getToken() },
          });

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
                      <h5>Prescription List</h5>
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
                              <th>History</th>
                              <th>Complaints</th>
                              <th>Print</th>
                              <th>Date</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptions.map((prescription) => (
                              <tr key={prescription.prescription_id}>
                                <td>{prescription?.patient?.patient_id}</td>
                                <td>{prescription?.patient?.name}</td>
                                <td>{prescription?.patient?.mobile_number}</td>
                                <td>{prescription?.prescription?.history}</td>
                                <td>{prescription?.prescription?.complaints}</td>
                                <td>
                                  <button
                                    onClick={() =>
                                      navigate(`/Print/${prescription.prescription_id}`)
                                    }
                                    className="btn btn-outline-light text-success p-2 mb-0 btn-sm ms-2"
                                  >
                                    <MdPrint size={15} />
                                  </button>
                                </td>
                                <td>{prescription?.prescription.createdAt.split("T")[0]}</td>
                                
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => deleteService(prescription.prescription_id)}
                                    >
                                      Delete
                                    </button>
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

export default PrescriptionList;
