import React from 'react';
import { Row, Col, Typography, Card, Button, Carousel } from 'antd';
import { GoogleLogin } from 'react-google-login';
import _get from 'lodash/get';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import './YourProfile.scss';
import { authServices } from '../../services/authServices';
import {
  AUTH_SET_AUTHENTICATED,
  AUTH_SET_USER_INFO,
} from '../../redux/types/authTypes';

function YourProfile(props) {
  const { handleCurrentAuthPageIndexChange } = props;
  const dispatch = useDispatch();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        authServices.googleLogin({ code: authResult['code'] }).then(
          (res) => {
            const { data } = res;
            const error = _get(data, 'error', {});

            if (!error.status) {
              const accessToken = _get(data.payload, 'tokens.access.token', '');
              const refreshToken = _get(
                data.payload,
                'tokens.refresh.token',
                ''
              );

              const userInfo = _get(data.payload, 'user', {});
              const setFirstPass = _get(data.payload, 'setFirstPass', false);

              if (accessToken) {
                localStorage.setItem('access_token', accessToken);
                dispatch({ type: AUTH_SET_AUTHENTICATED, payload: true });
              }
              if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
              }
              if (userInfo) {
                dispatch({ type: AUTH_SET_USER_INFO, payload: userInfo });
                localStorage.setItem('user_info', JSON.stringify(userInfo));
                localStorage.setItem('userId', userInfo.id);
              }

              if (setFirstPass) {
                localStorage.setItem('setFirstPass', setFirstPass);
              }
              handleCurrentAuthPageIndexChange(7);
            } else {
              toast.error(error.message);
            }
          },
          (error) => {
            toast.error('Error!');
          }
        );
      } else {
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Row>
        <Col className='your-profile-left-side' xs={24} sm={12}>
          <Row>
            <Typography.Title level={4} className='auth-flow-page-title'>
              Your Profile
            </Typography.Title>
          </Row>
          <Row>
            <Typography.Text style={{ color: 'white' }}>
              Create your <span className='font-color-red'>KloutKast</span>{' '}
              account to get started.
            </Typography.Text>
          </Row>
          <Row className='your-profile-signup-login-link'>
            <Col>
              <button onClick={() => handleCurrentAuthPageIndexChange(2)}>
                Sign up with email
              </button>
            </Col>
            <Col>&nbsp;•&nbsp;</Col>
            <Col>
              <button onClick={() => handleCurrentAuthPageIndexChange(5)}>
                Login
              </button>
            </Col>
          </Row>
          <Row className='btn-group'>
            <Col sm={24} xs={24}>
              <Card
                bordered={false}
                style={{ width: '100%', borderRadius: '50px' }}
              >
                {/* <Row justify="center">
                                    <Col>
                                        <Button className="btn-facebook">Connect With Facebook</Button>
                                    </Col>
                                </Row> */}
                <Row justify='center'>
                  <Col sm={24} xs={24}>
                    <GoogleLogin
                      className='btn-gmail'
                      // use your client id here
                      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                      buttonText='Connect With Gmail'
                      render={(renderProps) => (
                        <Button
                          className='btn-gmail'
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <Row justify='center'>Connect With Gmail</Row>
                        </Button>
                      )}
                      responseType='code'
                      /**
                       * To get access_token and refresh_token in server side,
                       * the data for redirect_uri should be postmessage.
                       * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
                       */
                      redirectUri='postmessage'
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    {/*  */}
                  </Col>
                </Row>
                {/* <Row justify="center">
                                    <Col>
                                        <Button className="btn-apple">Sign Up With Apple</Button>
                                    </Col>
                                </Row> */}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col className='your-profile-right-side' xs={0} sm={12}>
          <Carousel autoplay dotPosition='bottom'>
            <div>
              <Row className='right-side-wrapper1' align='bottom'>
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
            <div>
              <Row className='right-side-wrapper2' align='bottom'>
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
            <div>
              <Row className='right-side-wrapper3' align='bottom'>
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
            <div>
              <Row className='right-side-wrapper4' align='bottom'>
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
          </Carousel>
        </Col>
      </Row>
    </div>
  );
}

export default YourProfile;
