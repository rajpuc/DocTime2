import React,{Fragment, Suspense, lazy} from 'react';
import MasterLayout from '../Components/MasterLayout/MasterLayout';
import LazyLoader from './../Components/MasterLayout/LazyLoader';
const CreatePatient = lazy(() => import('../Components/Patient/CreatePatient'));

const CreatePatientPage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <CreatePatient/>
        </Suspense>
      </MasterLayout>
    </Fragment>
  );
};

export default CreatePatientPage;
