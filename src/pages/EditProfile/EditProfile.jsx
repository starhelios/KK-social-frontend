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
  Avatar
} from 'antd';
import { CameraOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ImgCrop from 'antd-img-crop';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';
import _get from 'lodash/get';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './EditProfile.scss';
import avatar_img from '../../assets/img/avatar.jpg';
import { authServices } from '../../services/authServices';
import { getUserInfo } from '../../redux/selectors/authSelector';
import { AUTH_SET_USER_INFO } from '../../redux/types/authTypes';
import { experienceServices } from '../../services/experienceService';

const EditProfile = (props) => {
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [newImage, setNewImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('');
  const [styleAvatar, setStyleAvatar] = useState({});
  const userInfoSelector = useSelector((state) => getUserInfo(state));
  const [showChangePass, setShowChangePass] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  console.log(typeof imageUrl)
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
    console.log('file...',file)
    let fileData = new FormData();
    fileData.append('image', file)
    experienceServices.uploadPhoto(fileData)
    .then(async(res) => {
          const { data } = res;
          const errorStatus = await _get(data, 'error.status', true);
          const payload =await  _get(data, 'payload', null);
        console.log(payload)
          if (!errorStatus) {
            setNewImage(true)
            const param = {
              avatarUrl: payload.uploadedPhoto
            }
            setTimeout(() =>{
              setImageUrl(payload.uploadedPhoto)
            },3000
            )
            authServices.updateUserInfo(userInfoSelector.randomString, param).then((res) => {
              const { data } = res;
              const errorStatus = _get(data, 'error.status', true);
              const errorMessage = _get(data, 'error.message', '');
              const payload = _get(data, 'payload', null);
              console.log(payload)
              if (!errorStatus) {
                toast.success('Successfully updated profile photo');
                dispatch({ type: AUTH_SET_USER_INFO, payload });
                setNewImage(false)
              } else {
                toast.error("Something went wrong saving profile photo");
              }
            });
            onSuccess(null, payload.uploadedPhoto);
          } else{
            onError(errorStatus)
            toast.error("Something went wrong")
          }
        });
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
        userId: userInfoSelector.randomString,
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
            .updateUserInfo(userInfoSelector.randomString, params)
            .then((res) => {
              const { data } = res;
              const errorStatus = _get(data, 'error.status', true);
              const errorMessage = _get(data, 'error.message', '');
              const payload = _get(data, 'payload', null);

              if (!showChangePass) {
                setLoadingSubmit(false);
              }

              if (!errorStatus) {
                dispatch({ type: AUTH_SET_USER_INFO, payload });
                setNewImage(false);
                toast.success("Successfully updated info,");
              } else {
                toast.error("Something went wrong. Please try again later");
              }
            });
        } else {
          toast.error("Something went wrong");
        }
      });
    } else {
      console.log('running')
      authServices.updateUserInfo(userInfoSelector.randomString, params).then((res) => {
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
          setNewImage(false)
        } else {
          toast.error(errorMessage);
        }
      });
    }
  };

  useEffect(() => {
    if (imageUrl) {
      console.log('image url...',imageUrl)
      setStyleAvatar({
        background: `url(${imageUrl}) center no-repeat`,
        position: 'relative',
        height: '150px',
        width: '150px',
        minHeight: "150px",
        minWidth: "150px",
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center', alignItems: 'flex-end', borderRadius: '50%'
      });
    }
  }, [imageUrl]);

  useEffect(() => {
    if (userInfoSelector) {
      setLoading(false);
      setValue('fullname', userInfoSelector.fullname, { shouldDirty: true });
      setValue('email', userInfoSelector.email, { shouldDirty: true });
      setValue('dateOfBirth',userInfoSelector && userInfoSelector.dateOfBirth ? moment(userInfoSelector.dateOfBirth): null, {shouldDirty: true})

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
            {console.log('image url...',imageUrl)}
            <Row className='edit-profile-photo' justify='center'
            align='middle' style={{ marginBottom: 33, position: 'relative', flexDirection: 'column'}}>
                <div>
                <ImgCrop>
                  <Upload
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    customRequest={customUpload}
                  >
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                    <Avatar size={150} src={imageUrl && imageUrl.length ? imageUrl : avatar_img} />
                      <CameraOutlined style={imageUrl.length ? {zIndex: 999, color: 'white', position: 'relative', bottom: 20}: {zIndex: 999, color: 'white', position: 'relative', bottom: 35}} />
                    
                    </div>
                  </Upload>
                </ImgCrop>
                </div>
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
                as={<DatePicker defaultPickerValue={false} size='middle' format='MM-DD-YYYY' />}
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
