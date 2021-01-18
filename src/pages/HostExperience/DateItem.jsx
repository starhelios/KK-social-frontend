import React, { useState, useEffect } from 'react';
import { Row, Col, Button, TimePicker } from 'antd';

const { RangePicker } = TimePicker;

const DateItem = ({
  item,
  isEditAll,
  setDayAvailable,
  idx,
  daysAvailable,
  price,
}) => {
  const [isEdit, setEdit] = useState(isEditAll);
  const [start, setStart] = useState('4:00 pm');
  const [end, setEnd] = useState('5:00 pm');
  const priceText = `$ ${price || 0} / person`;

  useEffect(() => {
    if (isEditAll) {
      setEdit(true);
    }

    setDayAvailable([
      ...daysAvailable.map((element) => {
        let result = element;
        result.startTime = start;
        result.endTime = end;

        return result;
      }),
    ]);
  }, [isEditAll]);

  const handleEdit = () => {
    if (isEdit) {
      console.log(start);
      console.log(end);
      console.log(idx);

      let result = [...daysAvailable];
      result[idx].startTime = start;
      result[idx].endTime = end;

      setDayAvailable(result);
    }
    setEdit(!isEdit);
  };

  const onChange = (time, timeString) => {
    setStart(timeString[0]);
    setEnd(timeString[1]);
  };

  console.log(start);
  console.log(end);
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
