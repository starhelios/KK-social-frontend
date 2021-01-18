import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import isEmail from 'validator/lib/isEmail';
import { authServices } from '../../services/authServices';

import './ForgotPassword.scss';

function ForgotPassword(props) {
  const { handleCurrentAuthPageIndexChange } = props;
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (values) => {
    console.log(values);
    authServices.forgotPassword(values).then(
      (res) => {
        const { data } = res;
        if (!data.error) {
          toast.success(data.message);
          handleCurrentAuthPageIndexChange(7);
        } else {
          toast.error(data.message);
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
        <Col className="forgot-left-side" xs={24} sm={12}>
          <Row align="middle" className="forgot-left-side-header">
            <Col sm={2} xs={2}>
              <button onClick={() => handleCurrentAuthPageIndexChange(5)}>
                <ArrowLeftOutlined className="btn-back" />
              </button>
            </Col>
            <Col sm={22} xs={22}>
              <Typography.Title level={4} className="auth-flow-page-title">
                Forgot Password
              </Typography.Title>
            </Col>
          </Row>

          <Row className="input-unit">
            <Col xs={24} sm={24}>
              <Row>
                <Typography.Text style={{ color: 'white' }}>
                  Email Address
                </Typography.Text>
              </Row>
              <Row>
                <input
                  type="text"
                  className="ant-input"
                  placeholder="Email Address"
                  name="email"
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter your email',
                    },
                    validate: (input) => isEmail(input),
                  })}
                />
                {errors.email && (
                  <div className="errorText">{errors.email.message}</div>
                )}
                {errors.email && errors.email.type === 'validate' && (
                  <div className="errorText">Wrong format email</div>
                )}
              </Row>
            </Col>
          </Row>
          <Row className="forgot-content" justify="center">
            <Col sm={18} xs={18}>
              <Row justify="center">
                <Typography.Text
                  style={{ color: 'white', textAlign: 'center' }}
                >
                  We will send a password reset email to the address above.
                </Typography.Text>
              </Row>
            </Col>
          </Row>

          <Row justify="center" className="confirmbtn">
            <Button htmlType="submit">Confirm</Button>
          </Row>
        </Col>
        <Col className="forgot-right-side" xs={0} sm={12}>
          <Carousel autoplay dotPosition="bottom">
            <div>
              <Row className="right-side-wrapper1" align="bottom">
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
            <div>
              <Row className="right-side-wrapper2" align="bottom">
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
            <div>
              <Row className="right-side-wrapper3" align="bottom">
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
            <div>
              <Row className="right-side-wrapper4" align="bottom">
                <h3>Surf Lessons with Kelly Slater</h3>
              </Row>
            </div>
          </Carousel>
        </Col>
      </Row>
    </form>
  );
}

export default ForgotPassword;
