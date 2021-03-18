import './SignUp.scss';
import React from 'react';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import _get from 'lodash/get';
import { useDispatch } from 'react-redux';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { authServices } from '../../services/authServices';
import { AUTH_SET_AUTHENTICATED, AUTH_SET_USER_INFO } from '../../redux/types/authTypes';

function SignUp(props) {
  const dispatch = useDispatch();
  const { handleCurrentAuthPageIndexChange } = props;
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (values) => {
    authServices.register(values).then(
      (res) => {
        const { data } = res;
        const error = _get(data, 'error', {});

        if (!error.status) {
          const accessToken = _get(data.payload, 'tokens.access.token', '');
          const refreshToken = _get(data.payload, 'tokens.refresh.token', '');
          const userInfo = _get(data.payload, 'user', {});

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
            localStorage.setItem('userId', userInfo.randomString);
          }
          handleCurrentAuthPageIndexChange(3);
        } else {
          toast.error(error.message);
        }
      },
      (error) => {
        console.log(error);
        toast.error('Error!');
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className='signup-left-side' xs={24} sm={12}>
          <Row align='middle' className='signup-left-side-header'>
            <Col sm={2} xs={2}>
              <button onClick={() => handleCurrentAuthPageIndexChange(1)}>
                <ArrowLeftOutlined className='btn-back' />
              </button>
            </Col>
            <Col sm={10} xs={10}>
              <Typography.Title level={4} className='auth-flow-page-title'>
                <Row justify='start'>
                  <span>Sign Up</span>
                </Row>
              </Typography.Title>
            </Col>
            <Col sm={11} xs={11} offset={1}>
              <Row justify='end'>
                <Typography.Text style={{ color: 'white', textAlign: 'right' }}>
                  Already have an account?
                </Typography.Text>
              </Row>
              <Row justify='end'>
                <button onClick={() => handleCurrentAuthPageIndexChange(5)}>
                  <Typography.Text style={{ color: '#979797' }}>
                    Log in
                  </Typography.Text>
                </button>
              </Row>
            </Col>
          </Row>

          <Row className='input-unit'>
            <Col sm={24} xs={24}>
              <Row>
                <Typography.Text style={{ color: 'white' }}>
                  Full Name
                </Typography.Text>
              </Row>
              <Row>
                <input
                  type='text'
                  className='ant-input'
                  placeholder='Full Name'
                  name='fullname'
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter your full name',
                    },
                  })}
                />
                {errors.fullname && (
                  <div className='errorText'>{errors.fullname.message}</div>
                )}
              </Row>
            </Col>
          </Row>
          <Row className='input-unit'>
            <Col sm={24} xs={24}>
              <Row>
                <Typography.Text style={{ color: 'white' }}>
                  Email Address
                </Typography.Text>
              </Row>
              <Row>
                <input
                  type='text'
                  className='ant-input'
                  placeholder='Email Address'
                  name='email'
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter your email',
                    },
                    validate: (input) => isEmail(input),
                  })}
                />
                {errors.email && (
                  <div className='errorText'>{errors.email.message}</div>
                )}
                {errors.email && errors.email.type === 'validate' && (
                  <div className='errorText'>Wrong format email</div>
                )}
              </Row>
            </Col>
          </Row>
          <Row className='input-unit'>
            <Col sm={24} xs={24}>
              <Row>
                <Typography.Text style={{ color: 'white' }}>
                  Password
                </Typography.Text>
              </Row>
              <Row>
                <input
                  type='password'
                  className='ant-input'
                  placeholder='Password'
                  name='password'
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter your password',
                    },
                  })}
                />
                {errors.password && (
                  <div className='errorText'>{errors.password.message}</div>
                )}
              </Row>
            </Col>
          </Row>
          <Row justify='center' className='createbtn'>
            <Col sm={20} xs={20}>
              <Button htmlType='submit'>Create Account</Button>
            </Col>
          </Row>
        </Col>
        <Col className='signup-right-side' xs={0} sm={12}>
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
          {/* </Row> */}
        </Col>
      </Row>
    </form>
  );
}

export default SignUp;
