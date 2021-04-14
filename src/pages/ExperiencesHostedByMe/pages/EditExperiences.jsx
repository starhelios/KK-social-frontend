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
  const [experience, setExperience] = useState(location.state.experience);
  const [daysAvailable, setDayAvailable] = useState([]);
  const [price, setPrice] = useState('');
  const [unEditableExperiences, setUneditableExperiences] = useState([]);
  const [editableExperiences, setEditableExperiences] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // const result = experience.specificExperience.filter((item) => item.usersGoing.length === 0)
    // const sortedResult = result.sort((a, b) => {
    //   return new Date(moment(a.day + " " + a.startTime).format()) - new Date(moment(b.day + " " + b.startTime).format())
    // })
    // console.log(sortedResult);
    // console.log(experience.specificExperience)
    let editableArray = [];
    let unEditableArray = [];

    location.state.experience.specificExperience.forEach((item, idx) => {
      return item.usersGoing.length === 0 ? editableArray.push(item): unEditableArray.push(item);
    })
    if(editableArray.length){

      const sortedEditableArray = editableArray.sort((a, b) => {
        return new Date(moment(a.day + " " + a.startTime).format()) - new Date(moment(b.day + " " + b.startTime).format())
      })
      const filteredEditableArray = sortedEditableArray.filter((element, idx) => {
        return new Date(moment(element.day + " " + element.startTime).format()) > new Date(moment().format())
      })
      setEditableExperiences(filteredEditableArray)
    }
    
    setUneditableExperiences(unEditableArray)

  }, [])
  console.log(editableExperiences)
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
            unEditableExperiences={unEditableExperiences}
            experience={experience}
              daysAvailable={daysAvailable}
              setPrice={setPrice}
              days={editableExperiences}
              setFormErrors={setFormErrors}
            />
            <EditDatesOfAvailability
              daysAvailable={daysAvailable}
              setDayAvailable={setDayAvailable}
              price={price}
              values={editableExperiences}
              setValues={setEditableExperiences}
              formErrors={formErrors}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default HostExperience;
