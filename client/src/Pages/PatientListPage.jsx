import React,{Fragment, Suspense, lazy} from 'react';
import MasterLayout from '../Components/MasterLayout/MasterLayout';
import LazyLoader from './../Components/MasterLayout/LazyLoader';
const PatientList = lazy(() => import('../Components/Patient/PatientList'));

const PatientListPage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <PatientList/>
        </Suspense>
      </MasterLayout>
    </Fragment>
  )
}

export default PatientListPage
