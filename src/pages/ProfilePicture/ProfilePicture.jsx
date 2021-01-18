import './ProfilePicture.scss';
import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { Row, Col, Typography, Upload, Button, message, Carousel } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import profilepicture_default_image from '../../assets/img/Signup/profilepicture_default.png';
import { storage } from '../../utils/firebase';

function ProfilePicture(props) {
  const dispatch = useDispatch();
  const { handleCurrentAuthPageIndexChange } = props;
  const [urlImage, setUrlImage] = useState('');

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

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        message.error(`${file.name} file upload failed.`);
        onError(error);
      },
      () => {
        storage
          .ref('images')
          .child(`${file.name}`)
          .getDownloadURL()
          .then((url) => {
            onSuccess(null, url);
            setUrlImage(url);
            dispatch({ type: 'SAVE_AVATAR', payload: url });
            message.success(`${file.name} file uploaded successfully`);
            handleCurrentAuthPageIndexChange(4);
          });
      }
    );
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
                <button onClick={() => handleCurrentAuthPageIndexChange(5)}>
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
                  Add a profile picture so hosts know who you are.
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
