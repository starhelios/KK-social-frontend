import './HeaderComponent.scss';
import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Skeleton } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _get from 'lodash/get';

import logo from '../../assets/img/logo.png';
import logo_black from '../../assets/img/logo_black.png';
import AuthComponent from '../../layouts/AuthComponent/AuthComponent';
import Navbar from '../Navbar/Navbar';
import { authServices } from '../../services/authServices';
import {
  AUTH_SET_AUTHENTICATED,
  AUTH_SET_USER_INFO,
} from '../../redux/types/authTypes';

const { Header } = Layout;

const NavLinkWithActivation = (props) => (
  <NavLink activeStyle={{ color: 'color' }} {...props} />
);

function HeaderComponent(props) {
  const { location, handleAuthChange } = props;
  const dispatch = useDispatch();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const handleShowSignUpModal = (value) => {
    setShowSignUpModal(value);
  };

  const hostedMe = location.pathname.includes('experiences-hosted-by-me');

  const bgColor =
    (location.pathname.includes('experience') ||
      location.pathname.includes('host')) &&
    !hostedMe
      ? '#eaeaea'
      : '#383838';
  const logo_img =
    (location.pathname.includes('experience') ||
      location.pathname.includes('host')) &&
    !hostedMe
      ? logo_black
      : logo;

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      authServices.getUserInfo(userId).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);

        if (!errorStatus) {
          setIsHost(payload.isHost);
          dispatch({ type: AUTH_SET_AUTHENTICATED, payload: true });
          dispatch({ type: AUTH_SET_USER_INFO, payload });
          handleAuthChange(true);
        } else {
          dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
          handleAuthChange(false);
        }
      });
    } else {
      dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
    }
  }, [location]);

  return (
    <Header className='header-component' style={{ background: bgColor }}>
      <Row>
        <AuthComponent
          showSignUpModal={showSignUpModal}
          handleShowSignUpModal={handleShowSignUpModal}
          handleAuthChange={handleAuthChange}
        />
      </Row>
      <Row>
        <Col md={4} sm={4} xs={4}>
          <NavLinkWithActivation to='/'>
            <img className='logo' src={logo_img} alt='logo' />
          </NavLinkWithActivation>
        </Col>
        <Col md={20} sm={20} xs={20}>
          <Row justify='end'>
            <Col md={24} sm={24} xs={24}>
              {localStorage.getItem('userId') ? (
                <Row align='middle'>
                  <Col md={24} sm={24} xs={24}>
                    <Row justify='end'>
                      <Navbar isHost={isHost} />
                    </Row>
                  </Col>
                  {/* <Col  md={4} sm={4} xs={4}>
                                        <Row justify="end" align="middle">
                                            <Avatar size={39.6} src={avatar_img}/>
                                        </Row>                                        
                                    </Col> */}
                </Row>
              ) : (
                <Row justify='end' className='signup-link'>
                  <button onClick={() => handleShowSignUpModal(true)}>
                    Sign up • Log in
                  </button>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
}

export default withRouter(HeaderComponent);
