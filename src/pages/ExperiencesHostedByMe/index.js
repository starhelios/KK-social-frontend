import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import _get from 'lodash/get';

import PopularExperience from '../../components/SwiperComponent/PopularExperience';
import PopularExperienceByMe from '../../components/SwiperComponent/PopularExperienceByMe';
import './styles.scss';
import { experienceServices } from '../../services/experienceService';
import { convertExperience } from '../../utils/utils';
import ExperienceCalendar from '../../components/SwiperComponent/ExperienceCalendar';

const ExperiencesHostedByMe = () => {
  const [experienceData, setExperienceData] = useState([]);

  useEffect(() => {
    experienceServices
      .getAllByUserId(localStorage.getItem('userId'))
      .then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);

        if (!errorStatus) {
          const result = convertExperience(payload);

          setExperienceData(result);
        }
      });
  }, []);
  return (
    <div className="dashboard-wrapper">
      <Row justify="end">
        <Col md={23} xs={23} sm={23}>
          <Row className="experiences-wrapper">
            <Col>
              <PopularExperienceByMe data={experienceData} />
            </Col>
          </Row>

          {/* <Row className='hosts-wrapper' style={{ marginBottom: 226 }}> */}
          <Row className="hosts-wrapper">
            <Col>
              <ExperienceCalendar data={experienceData} title="Calendar" />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ExperiencesHostedByMe;
