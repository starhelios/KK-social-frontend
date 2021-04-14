import './ProfilePicture.scss';
import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { Row, Col, Typography, Upload, Button, message, Carousel } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { AUTH_SET_USER_INFO } from '../../redux/types/authTypes';
import profilepicture_default_image from '../../assets/img/Signup/profilepicture_default.png';
import { experienceServices } from '../../services/experienceService';
import { authServices } from '../../services/authServices';
import { getUserInfo } from '../../redux/selectors/authSelector';

function ProfilePicture(props) {
  const dispatch = useDispatch();
  const { handleCurrentAuthPageIndexChange } = props;
  const [urlImage, setUrlImage] = useState('');
    const [newImage, setNewImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('');
    const userInfoSelector = useSelector((state) => getUserInfo(state));

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
                toast.success('Successfully added profile photo');
                dispatch({ type: AUTH_SET_USER_INFO, payload });
                setNewImage(false)
                handleCurrentAuthPageIndexChange(7);
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

  return (
    <div>
      <Row>
        <Col className='profilepicture-left-side' xs={24} sm={12}>
          <Row align='middle' className='profilepicture-left-side-header'>
            <Col sm={2} xs={2}>
              <button onClick={() => handleCurrentAuthPageIndexChange(2)}>
                <ArrowLeftOutlined className='btn-back' />
              </button>
            </Col>
            <Col sm={14} xs={14}>
              <Typography.Title level={4} className='auth-flow-page-title'>
                Profile Picture
              </Typography.Title>
            </Col>
            <Col sm={8} xs={8}>
              <Row justify='end'>
                <button onClick={() => handleCurrentAuthPageIndexChange(7)}>
                  <Typography.Text style={{ color: '#979797' }}>
                    Skip
                  </Typography.Text>
                </button>
              </Row>
            </Col>
          </Row>
          <Row justify='center'>
            <Col className='content' sm={14} xs={14}>
              <Row justify='center'>
                <Typography.Text style={{ color: 'white' }}>
                  Add a profile picture so people know who you are.
                </Typography.Text>
              </Row>

              <Row className='profilepicture' justify='center'>
                {urlImage && (
                  <img
                    src={urlImage}
                    alt=''
                    style={{
                      width: 165,
                      height: 165,
                      verticalAlign: 'center',
                      borderRadius: '50%',
                    }}
                  />
                )}
                {!urlImage && <img src={profilepicture_default_image} alt='' />}
              </Row>
            </Col>
          </Row>
          <Row justify='center' className='choosebtn'>
            <Col sm={20} xs={20}>
            <ImgCrop>
              <Upload
                fileList={[]}
                beforeUpload={beforeUpload}
                customRequest={customUpload}
              >
                <Button>Choose Photo</Button>
              </Upload>
              </ImgCrop>
            </Col>
          </Row>
        </Col>
        <Col className='profilepicture-right-side' xs={0} sm={12}>
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

export default ProfilePicture;
