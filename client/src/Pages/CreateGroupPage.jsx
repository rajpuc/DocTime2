import React,{Fragment, Suspense, lazy} from 'react';
import MasterLayout from '../Components/MasterLayout/MasterLayout';
import LazyLoader from './../Components/MasterLayout/LazyLoader';
const CreateGroup = lazy(() => import('../Components/Medicine/CreateGroup'));

const CreateMedicinePage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <CreateGroup/>
        </Suspense>
      </MasterLayout>
    </Fragment>
  )
}

export default CreateMedicinePage
