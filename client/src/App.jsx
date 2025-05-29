import React, { Fragment } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegistrationPage from "./Pages/RegistrationPage";
import { getToken } from "./Helper/SessionHelper";
import FullscreenLoader from "./Components/MasterLayout/FullscreenLoader";
import UserLogin from "./Pages/LoginPage";
import CreatePatientPage from "./Pages/CreatePatientPage";
import CreateMedicinePage from "./Pages/CreateMedicinePage";
import DashboardPage from "./Pages/DashboardPage";
import CreatePrescriptionPage from "./Pages/CreatePrescriptionPage";
import A4Page from "./Pages/A4Page";
import PrescriptionListPage from "./Pages/PrescriptionListPage";

function App() {
  if (getToken()) {
    return (
      <Fragment>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage/>} />
            <Route path="/CreatePatient" element={<CreatePatientPage/>} />
            <Route path="/PrescriptionList" element={<PrescriptionListPage/>} />
            <Route path="/Print/:id" element={<A4Page/>} />
            <Route path="/CreateMedicine" element={<CreateMedicinePage/>} />
            <Route path="/CreatePrescription" element={<CreatePrescriptionPage/>} />
          </Routes>
        </BrowserRouter>
        <FullscreenLoader />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <BrowserRouter>
          <Routes>
            <Route path="/Login" element={<UserLogin />} />
            <Route path="/Registration" element={<RegistrationPage />} />
            <Route path="*" element={<Navigate to="/Login" />} />
          </Routes>
        </BrowserRouter>
        <FullscreenLoader />
      </Fragment>
    );
  }
}

export default App;
