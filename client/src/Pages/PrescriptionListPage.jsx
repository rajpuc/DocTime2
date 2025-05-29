import React, { Fragment, Suspense, lazy } from "react";
import MasterLayout from "../Components/MasterLayout/MasterLayout";
import LazyLoader from "./../Components/MasterLayout/LazyLoader";
const PrescriptionList = lazy(() =>
  import("../Components/Prescription/PrescriptionList")
);
const PrescriptionListPage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <PrescriptionList />
        </Suspense>
      </MasterLayout>
    </Fragment>
  );
};

export default PrescriptionListPage;
