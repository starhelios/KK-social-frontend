import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import _get from 'lodash/get';
import { useDispatch } from 'react-redux';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { authServices } from '../../services/authServices';
import './Login.scss';
import {
  AUTH_SET_AUTHENTICATED,
  AUTH_SET_USER_INFO,
} from '../../redux/types/authTypes';

function Login(props) {
  const dispatch = useDispatch();
  const { handleCurrentAuthPageIndexChange } = props;
  const { register, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);
    authServices.login(values).then(
      (res) => {
        const { data } = res;
        const error = _get(data, 'error', {});
        setLoading(false);

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
            localStorage.setItem('userId', userInfo.id);
          }
          handleCurrentAuthPageIndexChange(7);
        } else {
          toast.error(error.message);
        }
      },
      (error) => {
        setLoading(false);
        toast.error('Error!');
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className='left-side' xs={24} sm={12}>
          <Row align='middle' className='left-side-header'>
            <Col sm={2} xs={2}>
              <button
                onClick={() => handleCurrentAuthPageIndexChange(2)}
                type='button'
              >
                <ArrowLeftOutlined className='btn-back' />
              </button>
            </Col>
            <Col sm={10} xs={10}>
              <Typography.Title level={4} className='auth-flow-page-title'>
                Log In
              </Typography.Title>
            </Col>
            <Col sm={12} xs={12}>
              <Row justify='end'>
                <Typography.Text style={{ color: 'white' }}>
                  Don't have an account?
                </Typography.Text>
              </Row>
              <Row justify='end'>
                <button
                  onClick={() => handleCurrentAuthPageIndexChange(2)}
                  type='button'
                >
                  <Typography.Text style={{ color: '#979797' }}>
                    Sign Up
                  </Typography.Text>
                </button>
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
                  name='email'
                  placeholder='Email Address'
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
            <Col xs={24} sm={24}>
              <Row>
                <Typography.Text style={{ color: 'white' }}>
                  Password
                </Typography.Text>
              </Row>
              <Row>
                <input
                  type='password'
                  className='ant-input'
                  name='password'
                  placeholder='Password'
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
          <Row
            justify='end'
            style={{ marginTop: '27px' }}
            className='forgot-password-btn'
          >
            <button
              type='button'
              onClick={() => handleCurrentAuthPageIndexChange(6)}
              style={{ color: '#979797' }}
            >
              <Typography.Text
                style={{
                  color: '#979797',
                  fontSize: '17.5px',
                  textDecoration: 'none',
                }}
              >
                Forgot Password?
              </Typography.Text>
            </button>
          </Row>
          <Row justify='center' className='loginbtn'>
            <Col sm={20} xs={20}>
              <Button htmlType='submit' loading={loading}>
                Log In
              </Button>
            </Col>
          </Row>
        </Col>
        <Col className='right-side' xs={0} sm={12}>
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
    </form>
  );
}

export default Login;
