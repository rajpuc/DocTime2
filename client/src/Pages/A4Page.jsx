import React,{Fragment, Suspense, lazy} from 'react';
import MasterLayout from '../Components/MasterLayout/MasterLayout';
import LazyLoader from './../Components/MasterLayout/LazyLoader';
const A4 = lazy(() => import('../Components/Prescription/A4'));

const A4Page = () => {
    return (
        <Fragment>
          <MasterLayout>
          <Suspense fallback={<LazyLoader/>}>
          <A4/>
          </Suspense>
          </MasterLayout>
        </Fragment>
    );
};

export default A4Page;