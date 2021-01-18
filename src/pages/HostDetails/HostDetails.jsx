import './HostDetails.scss';
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import LocationIcon from '../../assets/img/experience/location.png';
import ReviewIcon from '../../assets/img/experience/review_star.png';
import Avatar from 'antd/lib/avatar/avatar';
import { authServices } from '../../services/authServices';
import { experienceServices } from '../../services/experienceService';
import PopularExperience from '../../components/SwiperComponent/PopularExperience';
import { convertExperience } from '../../utils/utils';

const NavLinkWithActivation = (props) => (
  <NavLink activeStyle={{ color: 'color' }} {...props} />
);

function HostDetails() {
  const { id } = useParams();
  const [hostData, setHostData] = useState({});
  const [experienceData, setExperienceData] = useState([]);

  useEffect(() => {
    if (id) {
      authServices.getHostInfo(id).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);

        if (!errorStatus) {
          setHostData({
            ...payload.user,
            ratingMark: payload.ratingMark,
            ratingCount: payload.ratingCount,
          });
        }
      });

      experienceServices.getByUserId(id).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);

        if (!errorStatus) {
          const result = convertExperience(payload);

          setExperienceData(result);
        }
      });
    }
  }, [id]);

  return (
    <>
      <Row justify='end' className='host-details-wrapper'>
        <Col md={23} xs={23} sm={23}>
          <Row className='host-details-back-btn'>
            <NavLinkWithActivation to='/'>
              <Col>
                <ArrowLeftOutlined />
                <span className='exp-back-btn-context'>
                  Back to experiences
                </span>
              </Col>
            </NavLinkWithActivation>
          </Row>

          <Row className='host-details-content-wrapper'>
            <Col md={23} sm={23} xs={23} className='host-details-content'>
              <Row className='host-details-content-item'>
                <Col md={24} sm={24} xs={24}>
                  <Row align='middle'>
                    <Col md={18} sm={18} xs={18}>
                      <Row>
                        <h1>Hey, I'm {hostData.fullname}</h1>
                      </Row>
                      <Row>
                        <h3>
                          Joined in{' '}
                          {moment(hostData.joinDay).format('MMMM YYYY')}
                        </h3>
                      </Row>
                    </Col>
                    <Col md={6} sm={6} xs={6}>
                      <Row justify='end'>
                        <Avatar size={73.12} src={hostData.avatarUrl} />
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='host-details-content-item-line' />
              <Row className='host-details-content-item'>
                <Col sm={24} xs={24}>
                  <Row>
                    <h2>About this host</h2>
                  </Row>
                  <Row align='middle' justify='start'>
                    <Col>
                      <img src={LocationIcon} alt='' />
                    </Col>
                    <Col>
                      <h3>Brooklyn, NY</h3>
                    </Col>
                  </Row>
                  <Row align='middle' justify='start'>
                    <Col>
                      <img src={ReviewIcon} alt='' />
                    </Col>
                    <Col>
                      <h3>
                        {hostData.ratingMark} Stars • {hostData.ratingCount}{' '}
                        Ratings
                      </h3>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='host-details-content-item-line' />
              <Row className='host-details-content-item'>
                <Col md={24} sm={24} xs={24}>
                  <Row style={{ marginTop: '39px' }}>
                    <h3>{hostData.aboutMe}</h3>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          {experienceData.length > 0 && (
            <Row className='experiences-wrapper'>
              <Col>
                <PopularExperience
                  data={experienceData}
                  theme='dark'
                  title={`${hostData.fullname}'s Experiences`}
                  isDetail
                />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
}

export default HostDetails;
