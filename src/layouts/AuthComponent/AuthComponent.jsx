import './AuthComponent.scss';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import _get from 'lodash/get';

import YourProfile from '../../pages/YourProfile/YourProfile';
import SignUp from '../../pages/SignUp/SignUp';
import ProfilePicture from '../../pages/ProfilePicture/ProfilePicture';
import ProfilePictureChoosed from '../../pages/ProfilePictureChoosed/ProfilePictureChoosed';
import Login from '../../pages/Login/Login';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import {getQueryParams} from '../../utils/utils'

function AuthComponent(props) {
  const { showSignUpModal, handleShowSignUpModal, handleAuthChange } = props;
  const [currentAuthPageIndex, setCurrentAuthPageIndex] = React.useState(1);
  const handleCurrentAuthPageIndexChange = (value) => {
    setCurrentAuthPageIndex(value);
  };
  const handleShowSignUpModalfunc = () => {
    handleShowSignUpModal(false);
    handleCurrentAuthPageIndexChange(1);
  };

  useEffect(() => {
    const objParams = getQueryParams();
    const token = _get(objParams, 'token', '');
    if (token) {
      handleShowSignUpModal(true);
      handleCurrentAuthPageIndexChange(8);
    }
  }, []);

  return (
    <Modal
      className='signup-modal'
      width={1000}
      centered
      visible={showSignUpModal}
      maskClosable={false}
      onCancel={() => {
        handleShowSignUpModalfunc();
      }}
    >
      {currentAuthPageIndex === 1 ? (
        <YourProfile
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
        />
      ) : currentAuthPageIndex === 2 ? (
        <SignUp
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
        />
      ) : currentAuthPageIndex === 3 ? (
        <ProfilePicture
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
        />
      ) : currentAuthPageIndex === 4 ? (
        <ProfilePictureChoosed
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
        />
      ) : currentAuthPageIndex === 5 ? (
        <Login
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
          handleAuthChange={handleAuthChange}
        />
      ) : currentAuthPageIndex === 6 ? (
        <ForgotPassword
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
        />
      ) : currentAuthPageIndex === 7 ? (
        handleShowSignUpModalfunc()
      ) : currentAuthPageIndex === 8 ? (
        <ResetPassword
          handleCurrentAuthPageIndexChange={handleCurrentAuthPageIndexChange}
          token={_get(getQueryParams(), 'token', '')}
        />
      ) : (
        ''
      )}
    </Modal>
  );
}

export default AuthComponent;
