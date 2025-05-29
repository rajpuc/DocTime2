import React, { Fragment, Suspense, lazy } from 'react';
import LazyLoader from '../Components/MasterLayout/LazyLoader';

const UserLogin = lazy(() => import('../Components/User/UserLogin'));
const UserLoginPage = () => {
    return (
        <Fragment>
            <div>
                <Suspense fallback={<LazyLoader />}>
                    <UserLogin />
                </Suspense>
            </div>
        </Fragment>
    );
};

export default UserLoginPage;