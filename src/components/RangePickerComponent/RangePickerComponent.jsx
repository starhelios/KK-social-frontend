import React, { useState } from 'react';
import './RangePickerComponent.scss';
import { DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { none } from 'ramda';

const { RangePicker, Button, Row, Col } = DatePicker;

export const RangePickerComponent = () => {
  var start = {};
  var end = {};

  const [showDatepicker, setShowDatepicker] = useState(false);

  const handleShowDatepicker = (value) => {
    setShowDatepicker(value);
  };

  const handleApplyDatepicker = () => {
    if (end === null) handleShowDatepicker(true);
    else handleShowDatepicker(false);
    console.log(start);
    console.log(end);
  };

  const handleOpenChange = () => {
    console.log('handleOpenChange');
    handleShowDatepicker(true);
  };

  const handlePanelChange = (e) => {
    console.log('handlePanelChange');
  };

  const handleCalendarChange = (e) => {
    console.log(e[0]);
    if (e[1] !== null) {
      handleShowDatepicker(true);
      start = e[0];
      end = e[1];
    }
  };

  const handleChange = () => {
    console.log('handleChange');
  };
  return (
    <RangePicker
      className='search-dates'
      allowClear={true}
      suffixIcon={none}
      separator={'Dates'}
      bordered={false}
      onOpenChange={handleOpenChange}
      onPanelChange={handlePanelChange}
      onCalendarChange={handleCalendarChange}
      onChange={handleChange}
      open={showDatepicker}
      renderExtraFooter={() => {
        return (
          <div>
            <Row className='datepicker-header' justify='end'>
              <Col>
                <p>Dates</p>
              </Col>
              <Col>
                <Button onClick={handleApplyDatepicker}>
                  <CloseOutlined />
                </Button>
              </Col>
            </Row>
            <Row className='datapicker-footer-apply-btn' justify='center'>
              <Button onClick={handleApplyDatepicker}>Apply</Button>
            </Row>
          </div>
        );
      }}
    />
  );
};

export default RangePickerComponent;
