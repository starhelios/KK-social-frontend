import React from 'react';
import {
  Row,
  Col,
  Upload,
  message,
  Button,
  Input,
  DatePicker,
  Skeleton,
} from 'antd';
import { CameraOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ImgCrop from 'antd-img-crop';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import './EditProfile.scss';
import { storage } from '../../utils/firebase';
import { authServices } from '../../services/authServices';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../../redux/selectors/authSelector';
import { AUTH_SET_USER_INFO } from '../../redux/types/authTypes';

export const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [styleAvatar, setStyleAvatar] = useState({});
  const userInfoSelector = useSelector((state) => getUserInfo(state));
  const [showChangePass, setShowChangePass] = useState(false);
  const dispatch = useDispatch();

  let setFirstPass = localStorage.getItem('setFirstPass');
  if (setFirstPass === 'true') {
    setFirstPass = true;
  } else {
    setFirstPass = false;
  }

  const { handleSubmit, errors, reset, control, setValue, watch } = useForm({
    mode: 'onBlur',
  });

  const beforeUpload = (file) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      message.error('You can only upload image file!');
    }

    // You can remove this validation if you want
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  const customUpload = ({ onError, onSuccess, file }) => {
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    setLoading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        onError(error);
      },
      () => {
        storage
          .ref('images')
          .child(`${file.name}`)
          .getDownloadURL()
          .then((url) => {
            onSuccess(null, url);
            setImageUrl(url);
            setLoading(false);
          });
      }
    );
  };

  const onSubmit = async (values) => {
    const params = {
      dateOfBirth: values.dateOfBirth.toDate(),
      fullname: values.fullname,
      email: values.email,
    };

    if (imageUrl) {
      params.avatarUrl = imageUrl;
    }
    console.log('running')

    setLoadingSubmit(true);
    if (showChangePass) {
      const changePassParams = {
        userId: userInfoSelector.id,
        password: values.password,
        newPassword: values.newPassword,
        setFirstPass,
      };

      authServices.changePassword(changePassParams).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const errorMessage = _get(data, 'error.message', '');

        setLoadingSubmit(false);
        console.log('running')

        if (!errorStatus) {
          authServices
            .updateUserInfo(userInfoSelector.id, params)
            .then((res) => {
              const { data } = res;
              const errorStatus = _get(data, 'error.status', true);
              const errorMessage = _get(data, 'error.message', '');
              const payload = _get(data, 'payload', null);

              if (!showChangePass) {
                setLoadingSubmit(false);
              }

              if (!errorStatus) {
                toast.success("Successfully updated info");
                dispatch({ type: AUTH_SET_USER_INFO, payload });
              } else {
                toast.error(errorMessage);
              }
            });
        } else {
          toast.error("Something went wrong");
        }
      });
    } else {
      console.log('running')
      authServices.updateUserInfo(userInfoSelector.id, params).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const errorMessage = _get(data, 'error.message', '');
        const payload = _get(data, 'payload', null);
        console.log(payload)
        if (!showChangePass) {
          setLoadingSubmit(false);
        }

        if (!errorStatus) {
          toast.success('Successfully updated profile');
          dispatch({ type: AUTH_SET_USER_INFO, payload });
        } else {
          toast.error(errorMessage);
        }
      });
    }
  };

  useEffect(() => {
    if (imageUrl) {
      setStyleAvatar({
        background: `url(${imageUrl}) center center no-repeat`,
      });
    }
  }, [imageUrl]);

  useEffect(() => {
    if (userInfoSelector) {
      setLoading(false);
      setValue('fullname', userInfoSelector.fullname, { shouldDirty: true });
      setValue('email', userInfoSelector.email, { shouldDirty: true });
      setValue('dateOfBirth',userInfoSelector && userInfoSelector.dateOfBirth ? moment(userInfoSelector.dateOfBirth ): null, {shouldDirty: true})

      // warning
      if (userInfoSelector.avatarUrl) {
        setImageUrl(userInfoSelector.avatarUrl);
      }
    } else {
      setLoading(true);
    }
  }, [userInfoSelector]);

  return (
    <Col className='edit-profile-wrapper' sm={24} xs={24}>
      <Row className='edit-profile-header' justify='center'>
        <h2>Edit Profile</h2>
      </Row>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className='edit-profile-content'>
          <Col sm={24} xs={24}>
            <Row className='edit-profile-photo' justify='center'>
              {loading && (
                <Skeleton.Avatar
                  active={loading}
                  size={150}
                  shape='circle'
                  style={{ marginBottom: 33 }}
                />
              )}
              {!loading && (
                <ImgCrop>
                  <Upload
                    fileList={[]}
                    beforeUpload={beforeUpload}
                    customRequest={customUpload}
                  >
                    <Button style={styleAvatar}>
                      <CameraOutlined />
                    </Button>
                  </Upload>
                </ImgCrop>
              )}
            </Row>

            <Row>
              <h4>Full Name</h4>
            </Row>
            <Row>
              <Controller
                as={<Input />}
                name='fullname'
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must enter your full name',
                  },
                }}
              />
              {errors.fullname && (
                <div className='errorText'>{errors.fullname.message}</div>
              )}
            </Row>
            <Row className='edit-profile-line' />
            <Row>
              <h4>Email Address</h4>
            </Row>
            <Row>
              <Controller
                as={<Input />}
                name='email'
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must enter your email',
                  },
                  validate: (input) => isEmail(input),
                }}
              />
              {errors.email && (
                <div className='errorText'>{errors.email.message}</div>
              )}
              {errors.email && errors.email.type === 'validate' && (
                <div className='errorText'>Wrong format email</div>
              )}
            </Row>
            <Row className='edit-profile-line' />
            <Row>
              <h4>Date of Birth</h4>
            </Row>
            <Row>
              <Controller
                as={<DatePicker size='middle' format='MM-DD-YYYY' />}
                name='dateOfBirth'
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must choose birthday',
                  },
                }}
              />
            </Row>
            <Row className='edit-profile-line' />
            <Row className='security-wrapper'>
              <h4>Security</h4>
            </Row>
            <Row
              onClick={() => setShowChangePass(!showChangePass)}
              style={{ cursor: 'pointer' }}
            >
              <Col sm={16} xs={16}>
                <h3>{setFirstPass ? 'Set Password' : 'Change Password'}</h3>
              </Col>
              <Col sm={1} xs={1} offset={7}>
                <Row justify='end'>
                  <h3>
                    {showChangePass ? <DownOutlined /> : <RightOutlined />}
                  </h3>
                </Row>
              </Col>
            </Row>

            {showChangePass && (
              <>
                {!setFirstPass && (
                  <>
                    <Row style={{ marginTop: 30 }}>
                      <h4>Password</h4>
                    </Row>
                    <Row>
                      <Controller
                        as={
                          <Input placeholder='Enter Password' type='password' />
                        }
                        name='password'
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: 'You must enter password',
                          },
                        }}
                      />
                      {errors.password && (
                        <div className='errorText'>
                          {errors.password.message}
                        </div>
                      )}
                    </Row>
                    <Row className='edit-profile-line' />
                  </>
                )}

                <Row>
                  <h4>New Password</h4>
                </Row>
                <Row>
                  <Controller
                    as={
                      <Input placeholder='Enter New Password' type='password' />
                    }
                    name='newPassword'
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: 'You must enter new password',
                      },
                    }}
                  />
                  {errors.newPassword && (
                    <div className='errorText'>
                      {errors.newPassword.message}
                    </div>
                  )}
                </Row>
                <Row className='edit-profile-line' />
                <Row>
                  <h4>Confirm Password</h4>
                </Row>
                <Row>
                  <Controller
                    as={
                      <Input
                        placeholder='Enter Confirm Password'
                        type='password'
                      />
                    }
                    name='confirmPassword'
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: 'You must enter confirm password',
                      },
                      validate: (value) => value === watch('newPassword'),
                    }}
                  />
                  {errors.confirmPassword && (
                    <div className='errorText'>
                      {errors.confirmPassword.message}
                    </div>
                  )}
                  {errors.confirmPassword &&
                    errors.confirmPassword.type === 'validate' && (
                      <div className='errorText'>Not match</div>
                    )}
                </Row>
              </>
            )}

            <Row className='edit-profile-line' />
            <Row className='save-btn' justify='center'>
              <Col sm={20} xs={20}>
                <Button htmlType='submit' loading={loadingSubmit}>
                  Save
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </Col>
  );
};

export default EditProfile;
