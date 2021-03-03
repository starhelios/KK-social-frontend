import React, { useState, useEffect } from 'react';
import { Row, Col, Button, TimePicker } from 'antd';

const { RangePicker } = TimePicker;

const DateItem = ({
  item,
  isEditAll,
  setDayAvailable,
  idx,
  daysAvailable,
  values,
  price,
}) => {
  const [isEdit, setEdit] = useState(isEditAll);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const priceText = `$ ${price || 0} / person`;

  console.log(daysAvailable)

  useEffect(() => {
    if (isEditAll) {
      setEdit(true);
    }

    // setDayAvailable([
    //   ...daysAvailable.map((element) => {
    //     let result = element;
    //     result.startTime = start;
    //     result.endTime = end;

    //     return result;
    //   }),
    // ]);
  }, [isEditAll]);

  const handleEdit = () => {
    if (isEdit) {
      console.log(start);
      console.log(end);
      console.log(idx);

      let object = {}
      object.startDayTime = values[idx] + " " + start;
      object.endDayTime = values[idx] + " " + end;
      let newState = [...daysAvailable];
      newState[idx] = object;
      setDayAvailable(newState);
    }
    setEdit(!isEdit);
  };

  const onChange = (time, timeString) => {
    console.log(time, timeString)
    console.log(timeString[0])
    setStart(timeString[0]);
    setEnd(timeString[1]);
  };

  console.log(start);
  console.log(end);
  console.log(item)
  return (
    <Row
      className='host-experience-content-right-body-row-choose-item'
      align='middle'
    >
      <Col sm={14} xs={14}>
        <h6>{item}</h6>
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
              {`${start} - ${end} (EDT)`}
            </span>
          )}
        </h5>
        <h5>{priceText}</h5>
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

export default DateItem;
