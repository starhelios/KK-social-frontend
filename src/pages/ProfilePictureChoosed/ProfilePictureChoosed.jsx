import React from 'react';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getAvatarUrl } from '../../redux/selectors/authSelector';
import { authServices } from '../../services/authServices';

import './ProfilePictureChoosed.scss';

function ProfilePictureChoosed(props) {
  const avatarUrl = useSelector((state) => getAvatarUrl(state));
  const { handleCurrentAuthPageIndexChange } = props;

  const handleConfirm = () => {
    handleCurrentAuthPageIndexChange(5);
    const userInfo = localStorage.getItem('user_info');
    const userId = JSON.parse(userInfo).id;
    authServices.updateUserInfo(userId, { avatarUrl }).then((res) => {
      const { data } = res;
      console.log(data);
    });
  };

  return (
    <div>
      <Row>
        <Col className='profilepicturechoosed-left-side' xs={24} sm={12}>
          <Row
            align='middle'
            className='profilepicturechoosed-left-side-header'
          >
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
              <Row justify='end' align='middle'>
                <button onClick={() => handleCurrentAuthPageIndexChange(5)}>
                  <Typography.Text style={{ color: '#979797' }}>
                    Skip
                  </Typography.Text>
                </button>
              </Row>
            </Col>
          </Row>
          <Row justify='center'>
            <Col className='content' sm={18} xs={18}>
              <Row justify='center'>
                <Typography.Text style={{ color: 'white' }}>
                  If you need to make a change, tap your profile picture below.
                </Typography.Text>
              </Row>
              <Row className='profilepicture' justify='center'>
                <img
                  src={avatarUrl}
                  alt=''
                  style={{
                    width: 165,
                    height: 165,
                    verticalAlign: 'center',
                    borderRadius: '50%',
                  }}
                />
              </Row>
            </Col>
          </Row>
          <Row justify='center' className='confirmbtn'>
            <Col sm={20} xs={20}>
              <Button onClick={() => handleConfirm()}>Confirm Photo</Button>
            </Col>
          </Row>
        </Col>
        <Col className='profilepicturechoosed-right-side' xs={0} sm={12}>
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

export default ProfilePictureChoosed;
