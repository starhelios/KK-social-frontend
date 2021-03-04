import './EditExperience.scss';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import moment from 'moment'

import EditExperienceForm from './components/EditExperienceForm'
import EditDatesOfAvailability from './components/EditDatesOfAvailability';

const NavLinkWithActivation = (props) => (
  <NavLink activeStyle={{ color: 'color' }} {...props} />
);

function HostExperience(props) {
  const location = useLocation();
  const experience = location.state.experience
  const [daysAvailable, setDayAvailable] = useState([]);
  const [price, setPrice] = useState('');
  const [values, setValues] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const result = experience.specificExperience.filter((item) => item.usersGoing.length > 0)
    setValues(result)
  }, [])

  console.log(values)

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
            <EditExperienceForm
            experience={experience}
              daysAvailable={daysAvailable}
              setPrice={setPrice}
              days={values}
              setFormErrors={setFormErrors}
            />
            <EditDatesOfAvailability
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
