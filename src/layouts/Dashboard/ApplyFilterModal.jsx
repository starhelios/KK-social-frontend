import React from 'react';
import { Row, Col, Modal, Slider, Menu, Dropdown, Button } from 'antd';

import SearchLocationInput from './SearchLocationInput';

const ApplyFilterModal = ({
  showFilterModal,
  handleApplyFilters,
  handleShowModal,
  handleSliderChange,
  handleSliderAfterChange,
  selectedCategory,
  setSelectedCategory,
  categories,
  query,
  setQuery,
  cityChosen, 
  setCityChosen
}) => {
  const showDropDownMenu = () => {
    return (
      <Menu>
        {categories.map((elem, index) => {
          return (
            <Menu.Item
              onClick={() => {
                setSelectedCategory(elem);
              }}
            >
              <p>{elem.name}</p>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <Modal
      width={'375px'}
      title="Filters"
      visible={showFilterModal}
      okText="Apply Filters"
      cancelButtonProps={{ style: { display: 'none' } }}
      className="filter-modal"
      onOk={() => handleApplyFilters()}
      onCancel={() => handleShowModal(false)}
    >
      <Row className="price-group">
        <Col>
          <Row justify="start">
            <h1>Price</h1>
          </Row>
          <Row>
            <Col span={12}>
              <Row justify="start">
                <h2>$1</h2>
              </Row>
            </Col>
            <Col span={12}>
              <Row justify="end">
                <h2>$1000+</h2>
              </Row>
            </Col>
          </Row>
          <Slider
            className="price-slider"
            range
            min={1}
            max={1000}
            defaultValue={[1, 800]}
            onChange={handleSliderChange}
            onAfterChange={handleSliderAfterChange}
          />
        </Col>
      </Row>
      {/* <Row className="category-group">
        <Col md={24} sm={24} xs={24}>
          <Row>
            <h1>Category</h1>
          </Row>
          <Row align="middle" justify="start">
            <Col md={24} sm={24} xs={24}>
              <Dropdown overlay={showDropDownMenu}>
                <p style={{ fontSize: '20px' }}>{`${
                  selectedCategory ? selectedCategory.name : `Select Category`
                }`}</p>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row> */}
      <Row className="location-group">
        <Row>
          <Col>
            <h1>Location</h1>
          </Col>
        </Row>

        <SearchLocationInput query={query} setQuery={setQuery} pageClass="searched-item" cityChosen={cityChosen} setCityChosen={setCityChosen} showIcon={true} />
      </Row>
      <Row>
        <Button onClick={() => handleApplyFilters()} style={{backgroundColor: "#000000", width: '100%', borderRadius: '24.5px', color: 'white', fontFamily: 'Avenir Next', fontWeight: '600', fontSize: '14px', lineHeight: '14px', marginTop: '10px'}}>Apply</Button>
      </Row>
    </Modal>
  );
};

export default ApplyFilterModal;
