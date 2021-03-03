import React, { useState, useEffect } from 'react';
import { Row, Col, Button, TimePicker } from 'antd';
import _, { times } from 'lodash'

const { RangePicker } = TimePicker;

const EditDateItem = ({
  item,
  isEditAll,
  setDayAvailable,
  idx,
  daysAvailable,
  values,
  setValues,
  price
}) => {
  const [isEdit, setEdit] = useState(isEditAll);

  const handleEdit = () => {
    setEdit(!isEdit);
  };

  const onChange = (time, timeString) => {
    let clonedValues = _.cloneDeep(values);
    console.log(clonedValues)
      let object = {};
      object = clonedValues[idx];
      object.startTime = timeString[0];
      object.endTime = timeString[1];
      clonedValues[idx] = object;
      setValues(clonedValues)
  };

  return (
    <Row
      className='host-experience-content-right-body-row-choose-item'
      align='middle'
    >
      <Col sm={14} xs={14}>
        <h6>{item.day}</h6>
        <h5>
          {isEdit ? (
            <RangePicker
              use12Hours
              format='h:mm a'
              bordered={false}
              onChange={onChange}
            />
           ) : (
            <span style={{ textTransform: 'uppercase' }}>
              {`${item.startTime} - ${item.endTime} (EDT)`}
            </span>
           )}
        </h5>
        {/* <h5>{priceText}</h5> */}
      </Col>
      <Col sm={10} xs={10}>
        <Row justify='end'>
          <Button
            onClick={() => handleEdit()}
            className='host-experience-content-right-body-row-choose-item-btn'
          >
            {!isEdit ? 'Edit' : 'Save'}
          </Button>
        </Row>
      </Col>
    </Row>
  );
};

export default EditDateItem;
