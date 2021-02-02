import React, { useState } from 'react';
import { Row, Col, Button, DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

import { none } from 'ramda';
import DateItem from './DateItem';

const { RangePicker } = DatePicker;

const DatesOfAvailability = ({
  daysAvailable,
  setDayAvailable,
  price,
  values,
  setValues,
}) => {
  const [showDatepicker, setShowDatepicker] = React.useState(false);
  const [isEditAll, setEditAll] = useState(true);

  const handleShowDatepicker = (value) => {
    setShowDatepicker(value);
  };

  const handleApplyDatepicker = () => {
    handleShowDatepicker(false);
    setValues(values)
    // if (values.length > 0) {
    //   handleShowDatepicker(false);
    //   let dates = [
    //     {
    //       day: values[0].format('MMMM DD, YYYY'),
    //     },
    //   ];

    //   const currDate = moment(values[0]).startOf('day');
    //   const lastDate = moment(values[1]).startOf('day');

    //   while (currDate.add(1, 'days').diff(lastDate) < 0) {
    //     dates.push({
    //       day: currDate.clone().format('MMMM DD, YYYY'),
    //     });
    //   }

    //   dates.push({ day: values[1].format('MMMM DD, YYYY') });

    //   setDayAvailable(dates);
    // }
  };

  const handleOpenChange = () => {
    handleShowDatepicker(true);
  };

  const handleChange = (values) => {
    const newDates = values.map((item, idx) => {
      const newDate = moment(item).format('LL')
      return newDate
    })
    console.log(new Date().getFullYear())
    setValues(newDates);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };

  console.log(values);

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
                        onClick={() => setEditAll(true)}
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
                    <DateItem
                      key={index}
                      item={item}
                      idx={index}
                      isEditAll={isEditAll}
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
    </Col>
  );
};

export default DatesOfAvailability;
