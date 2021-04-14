import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import {useHistory} from 'react-router-dom'
import { authServices } from '../../services/authServices';

import './ResetPassword.scss';

function ResetPassword(props) {
  const { handleCurrentAuthPageIndexChange, token } = props;
  const { register, handleSubmit, errors, watch } = useForm();
  const history = useHistory();

  const onSubmit = (values) => {
    authServices.resetPassword(token, { password: values.password }).then(
      (res) => {
        const { data } = res;
        const error = _get(data, 'error', {});

        if (!error.status) {
          toast.success(error.message);
          console.log('pushing to another page')
          history.push('/')
          handleCurrentAuthPageIndexChange(5);
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
        <Col className='forgot-left-side' xs={24} sm={12}>
          <Row align='middle' className='forgot-left-side-header'>
            <Col sm={2} xs={2}>
              <button onClick={() => handleCurrentAuthPageIndexChange(5)}>
                <ArrowLeftOutlined className='btn-back' />
              </button>
            </Col>
            <Col sm={22} xs={22}>
              <Typography.Title level={4} className='auth-flow-page-title'>
                Reset Password
              </Typography.Title>
            </Col>
          </Row>

          <Row className='input-unit'>
            <Col xs={24} sm={24}>
              <Row>
                <Typography.Text style={{ color: 'white' }}>
                  New Password
                </Typography.Text>
              </Row>
              <Row>
                <input
                  type='password'
                  className='ant-input'
                  placeholder='New Password'
                  name='password'
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter new password',
                    },
                  })}
                />
                {errors.password && (
                  <div className='errorText'>{errors.password.message}</div>
                )}
              </Row>
            </Col>   
          </Row>

          <Row className='input-unit'>
              <Col xs={24} sm={24}>
                <Row>
                  <Typography.Text style={{ color: 'white' }}>
                    Confirm Password
                  </Typography.Text>
                </Row>
                <Row>
                  <input
                    type='password'
                    className='ant-input'
                    placeholder='Confirm Password'
                    name='confirmPassword'
                    ref={register({
                      validate: (value) => value === watch('password'),
                    })}
                  />
                  {errors.confirmPassword &&
                    errors.confirmPassword.type === 'validate' && (
                      <div className='errorText'>Not match</div>
                    )}
                </Row>
              </Col>
            </Row>

          <Row justify='center' className='confirmbtn'>
            <Button htmlType='submit'>Submit</Button>
          </Row>
        </Col>
        <Col className='forgot-right-side' xs={0} sm={12}>
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

export default ResetPassword;
