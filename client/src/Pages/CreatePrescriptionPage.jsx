import React,{Fragment, Suspense, lazy} from 'react';
import MasterLayout from '../Components/MasterLayout/MasterLayout';
import LazyLoader from './../Components/MasterLayout/LazyLoader';
const CreatePrescription = lazy(() => import('../Components/Prescription/CreatePrescription'));

const CreatePrescriptionPage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <CreatePrescription/>
        </Suspense>
      </MasterLayout>
    </Fragment>
  )
}

export default CreatePrescriptionPage
