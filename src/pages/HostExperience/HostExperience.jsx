import './HostExperience.scss';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import HostExperienceForm from './HostExperienceForm';
import DatesOfAvailability from './DatesOfAvailability';

const NavLinkWithActivation = (props) => (
  <NavLink activeStyle={{ color: 'color' }} {...props} />
);

function HostExperience(props) {
  const [daysAvailable, setDayAvailable] = useState([]);
  const [price, setPrice] = useState('');
  const [values, setValues] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  return (
    <>
      <Row justify='end' className='host-experience'>
        <Col md={23} xs={23} sm={23}>
          <Row className='host-experience-back-btn'>
            <NavLinkWithActivation to='/'>
              <Col>
                <ArrowLeftOutlined />
                <span className='host-experience-back-btn-context'>
                  Back to experiences
                </span>
              </Col>
            </NavLinkWithActivation>
          </Row>

          <Row className='host-experience-content'>
            <HostExperienceForm
              daysAvailable={daysAvailable}
              setPrice={setPrice}
              days={values}
              setFormErrors={setFormErrors}
            />
            <DatesOfAvailability
              daysAvailable={daysAvailable}
              setDayAvailable={setDayAvailable}
              price={price}
              values={values}
              setValues={setValues}
              formErrors={formErrors}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default HostExperience;
