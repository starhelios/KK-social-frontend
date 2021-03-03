import React, { useState } from 'react';
import { Row, Col, Button, DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

import { none } from 'ramda';
import EditDateItem from './EditDateItem';

const { RangePicker } = DatePicker;

const EditDatesOfAvailability = ({
  daysAvailable,
  setDayAvailable,
  price,
  values,
  setValues,
  formErrors
}) => {
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
                        // onClick={() => setEditAll(true)}
                      >
                        Edit All
                      </h5>
                    </Row>
                  </Col>
                </Row>
              )}
              <Row className='host-experience-content-right-body-row-choose'>
                <Col sm={24} xs={24}>
                  {values.map((item, index) => (
                    <EditDateItem
                      item={item}
                      idx={index}
                      setValues={setValues}
                      // isEditAll={isEditAll}
                      setDayAvailable={setDayAvailable}
                      values={values}
                      daysAvailable={daysAvailable}
                      price={price}
                    />
                  ))}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* {formErrors.availability ? errorDatePicker(): null} */}
    </Col>
  );
};

export default EditDatesOfAvailability;
