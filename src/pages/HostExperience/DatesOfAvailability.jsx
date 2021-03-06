import React, { useState } from 'react';
import { Row, Col, Button, DatePicker, TimePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

import { none } from 'ramda';
import DateItem from './DateItem';

const { RangePicker } = DatePicker;
const TimeRange = TimePicker.RangePicker;

const DatesOfAvailability = ({
  daysAvailable,
  setDayAvailable,
  price,
  values,
  setValues,
  formErrors
}) => {
  const [showDatepicker, setShowDatepicker] = React.useState(false);
  const [isEditAll, setEditAll] = useState(false);
  const [isEdit, setEdit] = useState(true)
  const [saved, setSaved] = useState(false)
  const [editAllTimes, setEditAllTimes] = useState([]);
  const [tempValue, setTempValue] = useState([]);

  const handleShowDatepicker = (value) => {
    setShowDatepicker(value);
  };

  const handleApplyDatepicker = () => {
    handleShowDatepicker(false);
    let difference = 0
    let datesArray = [];
    const startDate = tempValue[0];
    difference = parseInt(moment.duration(moment(tempValue[1]).diff(moment(tempValue[0]))).asDays());
    for(let i = 0; i <= difference; i++){
      const newDate = moment(startDate).add(i, 'days').format('LL');
      datesArray.push(newDate)
    }
    setValues(datesArray)
  };


  const handleOpenChange = () => {
    handleShowDatepicker(true);
  };
  console.log(daysAvailable)
  const handleEditAll = () => {
    setEditAll(false)
    setSaved(true)
      let newValues = [];
      values.map((item, idx) => {
        const object = new Object({startDayTime: `${item} ${editAllTimes[0]}`, endDayTime: `${item} ${editAllTimes[1]}`});
        newValues.push(object)
      })
      setDayAvailable(newValues)
  }

  const handleChange = (values) => {
    const newDates = values.map((item, idx) => {
      const newDate = moment(item).format('LL')
      return newDate
    })
    setTempValue(newDates);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };

  const errorDatePicker = () => {
    return (
      <div className="errorText">{formErrors.availability ? formErrors.availability: null}</div>
    )
  }
  console.log(values)
  console.log('edit all times...', editAllTimes)

  return (
    <Col
      md={{ span: 9, offset: 1 }}
      sm={{ span: 9, offset: 1 }}
      xs={23}
      className='host-experience-content-right'
    >
      <Row
        className='host-experience-content-right-header'
        justify='center'
        align='middle'
      >
        <Col className='dates-wrapper-col'>
          {/* <a className="search-values btn-border-white" onClick={() => handleShowDatesModal(true)}>Dates</a> */}
          <button>
            <RangePicker
              className='host-search-dates'
              allowClear={true}
              suffixIcon={none}
              separator={'Select Dates of Availability'}
              bordered={false}
              onOpenChange={handleOpenChange}
              onChange={handleChange}
              disabledDate={disabledDate}
              open={showDatepicker}
              renderExtraFooter={() => {
                return (
                  <div>
                    <Row
                      className='datepicker-header'
                      justify='end'
                      align='middle'
                    >
                      <Col>
                        <p>Dates</p>
                      </Col>
                      <Col>
                        <Button onClick={() => handleShowDatepicker(false)}>
                          <CloseOutlined />
                        </Button>
                      </Col>
                    </Row>
                    <Row
                      className='datapicker-footer-apply-btn'
                      justify='center'
                    >
                      <Button onClick={handleApplyDatepicker}>Apply</Button>
                    </Row>
                  </div>
                );
              }}
            />
            {/* <RangePickerComponent className="search-dates"/> */}
          </button>
        </Col>
      </Row>
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
                  {values.map((item, index) => (
                    <DateItem
                      key={index}
                      item={item}
                      idx={index}
                      isEditAll={isEditAll}
                      setDayAvailable={setDayAvailable}
                      values={values}
                      daysAvailable={daysAvailable}
                      price={price}
                      editAllTimes={editAllTimes}
                    />
                  ))}
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
      {formErrors.availability ? errorDatePicker(): null}
    </Col>
  );
};

export default DatesOfAvailability;
