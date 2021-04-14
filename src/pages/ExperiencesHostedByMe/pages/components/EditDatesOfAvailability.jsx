import React, { useState, useEffect } from 'react';
import { Row, Col, Button, DatePicker, TimePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

import { none } from 'ramda';
import EditDateItem from './EditDateItem';

const { RangePicker } = DatePicker;
const TimeRange = TimePicker.RangePicker;

const EditDatesOfAvailability = ({
  daysAvailable,
  setDayAvailable,
  price,
  values,
  setValues,
  formErrors
}) => {
  const [isEditAll, setEditAll] = useState(false);
  const [isEdit, setEdit] = useState(true)
  const [saved, setSaved] = useState(false)
  const [editAllTimes, setEditAllTimes] = useState([]);
  // const [showDatepicker, setShowDatepicker] = React.useState(false);
  // const [isEditAll, setEditAll] = useState(true);
  // const [tempValue, setTempValue] = useState([]);

  // const handleShowDatepicker = (value) => {
  //   setShowDatepicker(value);
  // };

  // const handleApplyDatepicker = () => {
  //   handleShowDatepicker(false);
  //   let difference = 0
  //   let datesArray = [];
  //   const startDate = tempValue[0];
  //   difference = parseInt(moment.duration(moment(tempValue[1]).diff(moment(tempValue[0]))).asDays());
  //   for(let i = 0; i <= difference; i++){
  //     const newDate = moment(startDate).add(i, 'days').format('LL');
  //     datesArray.push(newDate)
  //   }
  //   setValues(datesArray)
  // };

  // const handleOpenChange = () => {
  //   handleShowDatepicker(true);
  // };

  // const handleChange = (values) => {
  //   const newDates = values.map((item, idx) => {
  //     const newDate = moment(item).format('LL')
  //     return newDate
  //   })
  //   setTempValue(newDates);
  // };

  // const disabledDate = (current) => {
  //   // Can not select days before today and today
  //   return current && current < moment().startOf('day');
  // };

  // const errorDatePicker = () => {
  //   return (
  //     <div className="errorText">{formErrors.availability ? formErrors.availability: null}</div>
  //   )
  // }
  // console.log(values)

  // useEffect(() => {
  //   console.log(values)
  //   const mappedValues = values.map((item, idx) =>{
  //     return item.usersGoing === 0 ? item: {};
  //   })

  // }, [values])
  console.log(isEditAll)
  const handleEditAll = () => {
    setEditAll(false)
    setSaved(true)
    console.log(editAllTimes)
    console.log(values)
      let newValues = [];
      values.map((item, idx) => {
        let object = {...item};
        console.log(object)
        object.startTime = editAllTimes[0];
        object.endTime = editAllTimes[1]
        newValues.push(object)
      })
      console.log(newValues)
      setValues(newValues)
  }
  return (
    <Col
      md={{ span: 9, offset: 1 }}
      sm={{ span: 9, offset: 1 }}
      xs={23}
      className='host-experience-content-right'
    >
      <Row className='host-experience-content-right-body'>
        <Col sm={24} xs={24}>
          <Row className='host-experience-content-right-body-row'>
            <Col sm={24} xs={24}>
              {values.length > 0 && (
                <Row className='host-experience-content-right-body-row-date'>
                  <Col sm={18} xs={18}>
                    <h4>Active Dates</h4>
                  </Col>
                  <Col sm={6} xs={6}>
                    <Row justify='end'>
                      <h5
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditAll(!isEditAll)}
                      >
                        Edit All
                      </h5>
                    </Row>
                  </Col>
                </Row>
              )}
              {isEditAll === true && (
                <Row
      className='host-experience-content-right-body-row-choose-item'
      align='middle'
    >
                <Col sm={14} xs={14}>
        <h5>
          {isEdit ? (
            <TimeRange
              use12Hours
              format='h:mm a'
              bordered={false}
              onChange={(time, timestring) => setEditAllTimes(timestring)}
            />
          ) : (
            <span style={{ textTransform: 'uppercase' }}>
              {`${""} - ${""} (EDT)`}
            </span>
          )}
        </h5>
        </Col>
        <Col sm={10} xs={10}>
        <Row justify='end'>
          <Button
            onClick={() => handleEditAll()}
            style={{backgroundColor: 'black'}}
            className='host-experience-content-right-body-row-choose-item-btn'
          >
            {!isEdit ? 'Edit' : 'Save All'}
          </Button>
        </Row>
      </Col>
      </Row>
      )}
      
      {isEditAll || editAllTimes.length ? null: (
              <Row className='host-experience-content-right-body-row-choose'>
                <Col sm={24} xs={24}>
                  {values.length ? values.map((item, index) => (
                    <EditDateItem
                      item={item}
                      idx={index}
                      setValues={setValues}
                      isEditAll={isEditAll}
                      setDayAvailable={setDayAvailable}
                      values={values}
                      price={price}
                      editAllTimes={editAllTimes}
                    />
                  )): <div className="no-experiences-to-edit">All experiences have been booked</div>}
                </Col>
              </Row>
      )}
      {saved === true && (
        <div><span style={{ textTransform: 'uppercase' }}>
              {`${editAllTimes[0]} - ${editAllTimes[1]} (EDT)`}
            </span></div>
      )}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* {formErrors.availability ? errorDatePicker(): null} */}
    </Col>
  );
};

export default EditDatesOfAvailability;
