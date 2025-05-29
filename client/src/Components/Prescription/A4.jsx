import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { getToken } from "../../Helper/SessionHelper";
import { useParams } from "react-router-dom";
import { BaseURL } from "../../Helper/Config";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../Redux/StateSlice/SettingSlice";
import {
  IsEmpty,
  IsMobile,
  ErrorToast,
  SuccessToast,
} from "../../Helper/FormHelper";

const A4 = () => {
  const { id } = useParams();
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);

  const reactToPrintFn = useReactToPrint({ contentRef });
  
  useEffect(() => {
    const fetchSaleDetails = async () => {
      console.log(id);
      dispatch(ShowLoader());
      try {
        const response = await axios.get(`${BaseURL}/full-prescription/${id}`, {
          headers: { token: getToken() },
        });
        setPrescriptionDetails(response.data?.data);
      } catch (error) {
        ErrorToast(error.response?.data?.message || "Something went wrong.");
      } finally {
        dispatch(HideLoader());
      }
    };
    fetchSaleDetails();
  }, [id, dispatch]);
  return (
    <>
      <div
        ref={contentRef}
        className=" react-to-print a4-prescription"
        
      >
        <Row
          className=""
          style={{
            paddingTop: "12px",
            paddingBottom: "6px",
          }}
        >
          <Col>
            <Row style={{ marginBottom: "8px" }}>
              <Col xs={4}>
                Name: {prescriptionDetails?.medicines[0]?.patient_id?.name}
              </Col>
              <Col xs={2}>
                Age: {prescriptionDetails?.medicines[0]?.patient_id?.age}
              </Col>
              <Col xs={2}>
                Weight: {prescriptionDetails?.medicines[0]?.patient_id?.weight}
              </Col>
              <Col xs={4}>
                HBsAg: {prescriptionDetails?.medicines[0]?.patient_id?.HBsAg}
              </Col>
            </Row>
            <Row style={{ marginBottom: "6px" }}>
              <Col xs={4}>
                Tel:{" "}
                {prescriptionDetails?.medicines[0]?.patient_id?.mobile_number}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="prescription-det">
          <Col
            xs={5}
            className="d-flex flex-column justify-content-between h-100"
          >
            <Row>
              <Col>History: {prescriptionDetails?.prescription?.history}</Col>
            </Row>
            <Row>
              <Col>
                Complaints: {prescriptionDetails?.prescription?.complaints}
              </Col>
            </Row>
            <Row>
              <Col>Obsteric: {prescriptionDetails?.prescription?.obsteric}</Col>
            </Row>
            <Row>
              <Col>
                Menstrual: {prescriptionDetails?.prescription?.menstrual}
              </Col>
            </Row>
            <Row>
              <Col>Vaccine: {prescriptionDetails?.prescription?.vaccine}</Col>
            </Row>
            <Row>
              <Col>
                Past Medical: {prescriptionDetails?.prescription?.past_medicine}
              </Col>
            </Row>
            <Row>
              <Col>
                Past Surgical:{" "}
                {prescriptionDetails?.prescription?.past_surgical}
              </Col>
            </Row>
            <Row>
              <Col>
                Family/Social:{" "}
                {prescriptionDetails?.prescription?.family_social}
              </Col>
            </Row>
            <Row>
              <Col>
                Contraceptive:{" "}
                {prescriptionDetails?.prescription?.contraceptive}
              </Col>
            </Row>
            <Row>
              <Col>Drug: {prescriptionDetails?.prescription?.drug}</Col>
            </Row>
            <Row>
              <Col>
                Examination: {prescriptionDetails?.prescription?.examination}
              </Col>
            </Row>
            <Row>
              <Col>General: {prescriptionDetails?.prescription?.general}</Col>
            </Row>
            <Row>
              <Col>
                Obsterical: {prescriptionDetails?.prescription?.obsterical}
              </Col>
            </Row>
            <Row>
              <Col>
                Abdominal: {prescriptionDetails?.prescription?.abdominal}
              </Col>
            </Row>
            <Row>
              <Col>Pelvic: {prescriptionDetails?.prescription?.pelvic}</Col>
            </Row>
            <Row>
              <Col>
                Investigation:{" "}
                {prescriptionDetails?.prescription?.investigation}
              </Col>
            </Row>
            <Row>
              <Col>
                Provisional Dx:{" "}
                {prescriptionDetails?.prescription?.provisional_dx}
              </Col>
            </Row>
            <Row>
              <Col>
                Special Note: {prescriptionDetails?.prescription?.special_note}
              </Col>
            </Row>
          </Col>
          <Col className="bg-white">
            <ul className="d-flex flex-column gap-3">
              {prescriptionDetails &&
                prescriptionDetails.medicines.length > 0 &&
                prescriptionDetails.medicines.map((item, idx) => (
                  <li key={idx}>
                    <Row >
                      <Col>
                        <Row>
                          <Col className="fs-6">{item.medicine_name}</Col>
                        </Row>
                        <Row>
                          <Col>{item.schedule}</Col>
                        </Row>
                      </Col>
                    </Row>
                  </li>
                ))}
            </ul>
          </Col>
        </Row>
      </div>

      <div className="text-center mt-4 mb-4 d-print-none">
            <button className="btn btn-success" onClick={reactToPrintFn}>
              <i className="fa fa-print me-2"></i> Print Prescription
            </button>
      </div>


    </>
  );
};

export default A4;
