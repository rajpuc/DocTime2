import React,{Fragment, Suspense, lazy} from 'react';
import MasterLayout from '../Components/MasterLayout/MasterLayout';
import LazyLoader from './../Components/MasterLayout/LazyLoader';
const CreateMedicine = lazy(() => import('../Components/Medicine/CreateaMedicine'));

const CreateMedicinePage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <CreateMedicine/>
        </Suspense>
      </MasterLayout>
    </Fragment>
  )
}

export default CreateMedicinePage
