import './Profile.scss';
import React, { useState, useEffect } from 'react';
import { Link, NavLink, Redirect, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  RightOutlined,
  DownOutlined, DeleteFilled, ExclamationCircleOutlined
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
import ZoomIntegration from '../../components/ZoomIntegration/ZoomIntegration';
import { toast } from 'react-toastify';
import { paymentsServices } from '../../services/paymentServices';
import { isObject } from 'lodash';


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
  const [userLoadedIn, setUserLoadedIn] = useState(false);
  const [userStep, setUserStep] = useState([])

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
  const showDeleteConfirmation = (id) => {
    const { confirm } = Modal;
    confirm({
      title: 'Are you sure you want to delete this card?',
      icon: <ExclamationCircleOutlined />,
      content: 'When clicked the OK button, we will delete your card.',
      onOk() {
        handleDeleteButton(id);
      },
      onCancel() { },
    });
  };
  console.log(userInfoSelector)

  const handleDeleteButton = async (id) => {
    if (id) {
      const result = await paymentsServices.deletePaymentMethod({
        payment_method_id: id,
      });
      if (result.data.error.status) {
        toast.error('Failed to delete payment method.');
      } else {
        toast.success('Deleted payment method. Refreshing data.');
        setTimeout(() => {
          history.go(0);
        }, 2500);
      }
    } else {
      toast.error('Card data not found.');
    }
  };

  useEffect(() => {
    if (userInfoSelector && props.history.action === "POP") {
       determineStep(userInfoSelector.isHost)
    }
  }, [history, userInfoSelector])

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('getting user...', userId);
    if (userId) {
      authServices.getUserInfo(userId).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);
        console.log(payload)
        if (!errorStatus) {
          dispatch({ type: AUTH_SET_AUTHENTICATED, payload: true });
          dispatch({ type: AUTH_SET_USER_INFO, payload });
          setIsHost(payload.isHost);
          determineStep(payload.isHost);
        } else {
          dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
          history.push({
            pathname: '/',
            state: { needsToLogin: true }
          })
        }
      });
    } else {
      dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
      history.push({
        pathname: '/',
        state: { needsToLogin: true }
      })
    }

    const objParams = getQueryParams();
    const becomeHost = _get(objParams, 'becomeHost', '');
    if (becomeHost) {
      setProfileContentSwitch(2);
    }
  }, []);

  useEffect(() => {
    const token = window.location.search.split('?code=')[1];
    console.log(token)
    console.log(window.location)
    console.log(userInfoSelector && userInfoSelector.randomString && token)
    console.log(userInfoSelector)
    //send to backend to receive
    if (userInfoSelector && userInfoSelector.randomString && window.location.href.indexOf('/profile?code=') > -1) {
      console.log('running api')
      authServices.updateUserInfo(userInfoSelector.randomString, { zoomAuthToken: token, email: userInfoSelector.email }).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const errorMessage = _get(data, 'error.message', '');
        const payload = _get(data, 'payload', null);
        console.log(data)
        if (!errorStatus) {
          setProfileContentSwitch(1)
          toast.success('Thank you for connecting your Zoom account');
        } else {
          console.log(errorStatus)
          toast.error("You have already connected your zoom account");
          history.push('/profile')
        }
      })
    }
  }, [userInfoSelector]);

  const determineStep = (host) => {
    if(!host){
      console.log('user is host...',host)
      return setUserStep(hostingOptionsStepOne);
    }
    else if (host && userInfoSelector && !userInfoSelector.zoomConnected || userInfoSelector && !userInfoSelector.stripeAccountVerified) {
      console.log('step two...')
      return  setUserStep(hostingOptionsStepTwo);
    }else if(userInfoSelector && userInfoSelector.zoomConnected && userInfoSelector.stripeAccountVerified) {
      console.log('step three...')
      return setUserStep(hostingOptionsStepThree);
    }
  }
  console.log(userInfoSelector)
  const determineAction = (title) => {
    switch(title){
      case 'Become a Host':
        return setProfileContentSwitch(2);
      case "Edit Host Profile":
        return setProfileContentSwitch(2)
      case 'Withdrawal Options':
        return setProfileContentSwitch(4);
      case 'Zoom':
        return setProfileContentSwitch(5);
      case 'Host an Experience':
        return history.push('/hostexperience');
      case 'Experiences Hosted by Me':
        return history.push('/experiences-hosted-by-me');
      case 'Confirmed Bookings':
        return history.push('/confirmed-bookings');
      case 'Edit Withdrawal Options':
        return setProfileContentSwitch(4);
      default:
        return null

    }
  }
  const hostingOptionsStepOne = [{
    title: "Become a Host",
  }]
  const hostingOptionsStepTwo = [
    {
      title: 'Withdrawal Options',
    },
    {
      title: 'Zoom',
    },
  ]
  const hostingOptionsStepThree = [
    {
      title: "Edit Host Profile",
    },
    {
      title: 'Host an Experience',
    },
    {
      title: 'Experiences Hosted by Me',
    },
    {
      title: 'Confirmed Bookings',
    },
    {
      title: 'Edit Withdrawal Options',
    },
  ]
  console.log(userInfoSelector)
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
      <div>
        <Row>
          {userInfoSelector && !userInfoSelector.stripeAccountVerified && isHost &&
            <div style={{ textAlign: 'center', width: '100%' }} className="errorText">
              Please complete withdrawal to begin hosting experiences
         </div>
          }
          {userInfoSelector && !userInfoSelector.zoomConnected && isHost && (
            <div style={{ textAlign: 'center', width: '100%' }} className="errorText">
              Please connect Zoom account to begin hosting experiences
            </div>
          )}
        </Row>
      </div>
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
                                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                                // className="profile-available-cards"
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
                                <Button
                                  onClick={() => showDeleteConfirmation(cardElem.id)}
                                  style={{
                                    width: '50px',
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    color: 'white',
                                    boxShadow: 'none',
                                    background: 'transparent',
                                    marginLeft: '20px'
                                  }}
                                  type="primary"><DeleteFilled /></Button>
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
                            fontFamily: 'Avenir Next',
                            fontWeight: '600',
                            fontSize: '14px',
                            width: '20%',
                            display: 'inline-block',
                            textAlign: 'center',
                            color: '#383838',
                            borderRadius: '50px',
                            borderColor: 'white',
                            background: 'white',
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
                    {userStep.map((item, idx) => {
                      return (
                        <>
                      <Row
                        style={{ cursor: 'pointer' }}
                        onClick={() => determineAction(item.title)}
                      >
                        <Col sm={8} xs={8}>
                          <h3>{item.title}</h3>
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
                      )
                    })}
                  {/* <Row
                    style={{ cursor: 'pointer' }}
                    onClick={() => { return isHost ? history.push('/experiences-hosted-by-me') : setProfileContentSwitch(2) }}
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
                    onClick={() => { return isHost ? setProfileContentSwitch(4) : setProfileContentSwitch(2) }}
                  >
                    {userInfoSelector && !userInfoSelector.stripeAccountVerified ?
                      <Col sm={8} xs={8}>
                        <h3>Withdrawal Options</h3>
                      </Col>
                      : <Col sm={8} xs={8}>
                        <h3>Edit Withdrawal Options</h3>
                      </Col>
                    }
                    <Col sm={1} xs={1} offset={15}>
                      <Row justify="end">
                        <h3>
                          <RightOutlined />
                        </h3>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="profile-line" />
                  {userInfoSelector && !userInfoSelector.zoomAccessToken && <div><Row
                    style={{ cursor: 'pointer' }}
                    onClick={() => { return isHost ? setProfileContentSwitch(5) : setProfileContentSwitch(2) }}
                  >
                    <Col sm={8} xs={8}>
                      <h3>Zoom</h3>
                    </Col>
                    <Col sm={1} xs={1} offset={15}>
                      <Row justify="end">
                        <h3>
                          <RightOutlined />
                        </h3>
                      </Row>
                    </Col>
                  </Row>
                    <Row className="profile-line" /> </div>} */}
                </Col>
              </Row>
              <Row className="input-unit">
                <Col sm={24} xs={24}>
                  <Row>
                    <h4>Legal</h4>
                  </Row>
                  <Link to="/terms-of-service" className="profile-link">
                    <Row>
                      <h3>Terms of Service</h3>
                    </Row>
                  </Link>
                  <Row className="profile-line" />
                </Col>
              </Row>
              <Row className="input-unit">
                <Col sm={24} xs={24}>
                  <Link to="/privacy-policy" className="profile-link">
                    <Row>
                      <h3>Privacy Policy</h3>
                    </Row>
                  </Link>
                  <Row className="profile-line" />
                </Col>
              </Row>
              <Row className="input-unit">
                <Col sm={24} xs={24}>
                  <Link to="/support" className="profile-link">
                    <Row>
                      <h3>Support</h3>
                    </Row>
                  </Link>
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
                {profileContentSwitch === 2 && <BecomeHost isHost={isHost} />}
                {profileContentSwitch === 3 && (
                  <EditAddDeletePaymentMethod
                    selectedCard={selectedCard}
                    isEditMode={isCardEditMode}
                    userData={userInfoSelector}

                  />
                )}
                {profileContentSwitch === 4 && <WithdrawalOption />}
                {profileContentSwitch === 5 && !userInfoSelector.zoomConnected && <ZoomIntegration userInfoSelector={userInfoSelector} />}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(Profile);
