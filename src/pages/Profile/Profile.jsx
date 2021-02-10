import './Profile.scss';
import React, { useState, useEffect } from 'react';
import { NavLink, Redirect, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'antd';
import {
  ArrowLeftOutlined,
  RightOutlined,
  DownOutlined,
} from '@ant-design/icons';
import _get from 'lodash/get';

import EditProfile from '../../pages/EditProfile/EditProfile';
import EditAddDeletePaymentMethod from '../../pages/AddEditDeletePaymentMethod/EditAddDeletePaymentMethod';
import { authServices } from '../../services/authServices';
import {
  AUTH_SET_AUTHENTICATED,
  AUTH_SET_USER_INFO,
} from '../../redux/types/authTypes';
import { getUserInfo } from '../../redux/selectors/authSelector';
import BecomeHost from '../BecomeHost';
import { getQueryParams } from '../../utils/utils';
import WithdrawalOption from '../WithdrawalOptions/WithdrawalOption';

const NavLinkWithActivation = (props) => (
  <NavLink activeStyle={{ color: 'color' }} {...props} />
);

export const Profile = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const userInfoSelector = useSelector((state) => getUserInfo(state));
  const [isHost, setIsHost] = useState(false);
  const [profileContentSwitch, setProfileContentSwitch] = useState(1);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCardEditMode, setIsCardEditMode] = useState(false);

  const handleLogout = () => {
    authServices
      .logout({ refreshToken: localStorage.getItem('refresh_token') })
      .then((res) => {
        console.log(res);
      });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('userId');
    localStorage.removeItem('setFirstPass');

    dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
    history.push('/');
  };
  

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
        } else {
          dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
          history.push('/');
        }
      });
    } else {
      dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
      history.push('/');
    }

    const objParams = getQueryParams();
    const becomeHost = _get(objParams, 'becomeHost', '');
    if (becomeHost) {
      setProfileContentSwitch(2);
    }
  }, []);

  useEffect(() => {
    console.log(userInfoSelector);
  }, [userInfoSelector]);

  console.log(isHost);

  return (
    <div className="profile-wrapper">
      <Row className="profile-back-btn">
        <NavLinkWithActivation to="/">
          <Col>
            <ArrowLeftOutlined />
            <span className="profile-back-btn-context">Back</span>
          </Col>
        </NavLinkWithActivation>
      </Row>
      <Row className="profile-content">
        <Col sm={24} xs={24}>
          <Row>
            <Col className="profile-left-side" xs={24} sm={14}>
              <Row className="profile-left-side-header">
                <Col sm={24} xs={24}>
                  <Row>
                    <h1>Profile</h1>
                  </Row>
                </Col>
              </Row>

              <Row className="input-unit">
                <Col sm={24} xs={24}>
                  <Row>
                    <h4>Account Settings</h4>
                  </Row>
                  <Row>
                    <button
                      onClick={() => setProfileContentSwitch(1)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Col sm={8} xs={8}>
                        <Row justify="start">
                          <h3>Edit Profile</h3>
                        </Row>
                      </Col>
                      <Col sm={1} xs={1} offset={15}>
                        <Row justify="end">
                          <h3>
                            <RightOutlined />
                          </h3>
                        </Row>
                      </Col>
                    </button>
                  </Row>
                  <Row className="profile-line" />
                  <Row
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowPaymentMethods((elem) => !elem);
                      // setProfileContentSwitch(3)
                    }}
                  >
                    <Col sm={8} xs={8}>
                      <h3>Payment Methods</h3>
                    </Col>
                    <Col sm={1} xs={1} offset={15}>
                      <Row justify="end">
                        <h3>
                          {showPaymentMethods ? (
                            <DownOutlined />
                          ) : (
                            <RightOutlined />
                          )}
                        </h3>
                      </Row>
                    </Col>
                  </Row>
                  {showPaymentMethods && (
                    <>
                      {userInfoSelector.availableMethods &&
                        userInfoSelector.availableMethods.length > 0 &&
                        userInfoSelector.availableMethods.map(
                          (cardElem, cardIndex) => {
                            return (
                              <Row
                                style={{ cursor: 'pointer' }}
                                className="profile-available-cards"
                                onClick={() => {
                                  // setShowPaymentMethods((elem) => !elem);
                                  setSelectedCard(cardElem);
                                  setIsCardEditMode(true);
                                  setProfileContentSwitch(3);
                                }}
                              >
                                <h4 style={{ marginTop: '0' }}>
                                  {cardIndex + 1}. {cardElem.cardBrand} ending
                                  with {cardElem.last4digits}
                                </h4>
                              </Row>
                            );
                          }
                        )}
                      <Row
                        style={{ cursor: 'pointer', marginTop: '20px' }}
                        onClick={() => {
                          setSelectedCard(null);
                          setIsCardEditMode(false);
                          setProfileContentSwitch(3);
                        }}
                      >
                        <Button
                          style={{
                            width: '20%',
                            display: 'inline-block',
                            textAlign: 'center',
                            color: 'white',
                            borderColor: '#D42F36',
                            background: '#D42F36',
                          }}
                          type="primary"
                        >
                          Add Card
                        </Button>
                      </Row>
                    </>
                  )}
                  <Row className="profile-line" />
                </Col>
              </Row>
              <Row className="input-unit">
                <Col sm={24} xs={24}>
                  <Row>
                    <h4>Hosting</h4>
                  </Row>
                  {isHost && (
                    <>
                      <Row
                        style={{ cursor: 'pointer' }}
                        onClick={() => history.push('/hostexperience')}
                      >
                        <Col sm={8} xs={8}>
                          <h3>Host an Experience</h3>
                        </Col>
                        <Col sm={1} xs={1} offset={15}>
                          <Row justify="end">
                            <h3>
                              <RightOutlined />
                            </h3>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="profile-line" />
                    </>
                  )}
                  { isHost && (
                    <>
                      <Row
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          history.push('/experiences-hosted-by-me')
                        }
                      >
                        <Col sm={8} xs={8}>
                          <h3>Experiences Hosted by Me</h3>
                        </Col>
                        <Col sm={1} xs={1} offset={15}>
                          <Row justify="end">
                            <h3>
                              <RightOutlined />
                            </h3>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="profile-line" />
                    </>
                  )}

                  {!isHost && (
                    <>
                      <Row
                        style={{ cursor: 'pointer' }}
                        onClick={() => setProfileContentSwitch(2)}
                      >
                        <Col sm={8} xs={8}>
                          <h3>Become a Host</h3>
                        </Col>
                        <Col sm={1} xs={1} offset={15}>
                          <Row justify="end">
                            <h3>
                              <RightOutlined />
                            </h3>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="profile-line" />
                    </>
                  )}

                  <Row>
                    <Col sm={8} xs={8}>
                      <h3>Confirmed Bookings</h3>
                    </Col>
                    <Col sm={1} xs={1} offset={15}>
                      <Row justify="end">
                        <h3>
                          <RightOutlined />
                        </h3>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="profile-line" />
                  <Row
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProfileContentSwitch(4)}
                  >
                    <Col sm={8} xs={8}>
                      <h3>Withdrawal Options</h3>
                    </Col>
                    <Col sm={1} xs={1} offset={15}>
                      <Row justify="end">
                        <h3>
                          <RightOutlined />
                        </h3>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="profile-line" />
                </Col>
              </Row>
              <Row className="input-unit">
                <Col sm={24} xs={24}>
                  <Row>
                    <h4>Legal</h4>
                  </Row>
                  <Row>
                    <h3>Terms of Service</h3>
                  </Row>
                  <Row className="profile-line" />
                </Col>
              </Row>
              <Row className="logout-btn" onClick={() => handleLogout()}>
                Log Out
              </Row>
            </Col>
            <Col className="profile-right-side" xs={0} sm={9} offset={1}>
              <Row className="right-side-wrapper" justify="center">
                {profileContentSwitch === 1 && <EditProfile />}
                {profileContentSwitch === 2 && <BecomeHost />}
                {profileContentSwitch === 3 && (
                  <EditAddDeletePaymentMethod
                    selectedCard={selectedCard}
                    isEditMode={isCardEditMode}
                    userData={userInfoSelector}
                  />
                )}
                {profileContentSwitch === 4 && <WithdrawalOption />}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(Profile);
