import React, { useState, useCallback, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  Input,
  AutoComplete,
  InputNumber,
  Menu,
  Dropdown,
} from 'antd';
import _debounce from 'lodash/debounce';
import { useForm, Controller } from 'react-hook-form';
import _get from 'lodash/get';
import { toast } from 'react-toastify';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

import UploadPhoto from '../../components/UploadPhoto/UploadPhoto';
import SearchIcon from '../../assets/img/search-icon.png';
import { categoryServices } from '../../services/categoryService';
import { experienceServices } from '../../services/experienceService';
import { formatDateBE } from '../../utils/utils';

const { TextArea } = Input;

const HostExperienceForm = ({ setPrice, days, values, daysAvailable }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { register, handleSubmit, errors, control, watch } = useForm();
  const [images, setImages] = useState([]);

  const price = watch('price');

  useEffect(() => {
    setPrice(price);
  }, [price]);

  useEffect(() => {
    const fetchData = async () => {
      callApiSearch('');
    };
    fetchData();
  }, []);
  const callApiSearch = (value) => {
    categoryServices.searchCategory(value).then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);

      if (!errorStatus) {
        setCategories(payload);
      }
    });
  };

  const handleSeachCategories = useCallback(_debounce(callApiSearch, 1000), []);

  const onSubmit = (values) => {
    if (images.length === 0) {
      toast.error('Please upload photos');
      return;
    }
    // if (specificExperience.length === 0) {
    //   toast.error('Please select dates of availability');
    //   return;
    // }

    //TODO breakdown time/dates
    console.log(daysAvailable)
    const addMinutes =  function (dt, minutes) {
      return new Date(dt.getTime() + minutes * 60000);
    };
    
    let specificExperiences = [];
    daysAvailable.forEach((element) => {
      let start = new Date(moment(element.startDayTime).format());
      let end = new Date(moment(element.endDayTime).format());
      let firstEnd = addMinutes(start, values.duration);
      let startingObject = {
        day: moment(start).format('LL'),
        startTime: moment(start).format('LT'),
        endTime: moment(firstEnd).format('LT')
      }
      specificExperiences.push(startingObject);
      while (start < end){
        let newStartDate = addMinutes(start, values.duration)
        let newEndDate = addMinutes(newStartDate, values.duration)
        let object = {
          day: moment(newStartDate).format('LL'),
          startTime: moment(newStartDate).format('LT'),
          endTime: moment(newEndDate).format('LT')
        };
        console.log(newEndDate < end)
        if(object.startTime !== object.endTime && newEndDate < end && newStartDate < end){
          specificExperiences.push(object);
        }
        start = addMinutes(start, values.duration);

      }
    })

    let params = {
      ...values,
      specificExperiences,
      images,
      duration: values.duration,
      price: values.price,
      startDay: moment(days[0]).format(formatDateBE),
      endDay: moment(days[1]).format(formatDateBE),
      categoryName: selectedCategory.name,
    };

    experienceServices.createExperience(params).then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const errorMessage = _get(data, 'error.message', '');
      const payload = _get(data, 'payload', null);

      if (!errorStatus) {
        toast.success('Host an experience success!');
      } else {
        toast.error(errorMessage);
      }
    });
  };

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
    <Col md={13} sm={13} xs={23} className="host-experience-content-left">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="host-experience-content-left-item">
          <h1>Host an Experience</h1>
          <h3>Create your experience below.</h3>
        </Row>
        <Row className="host-experience-content-left-item-line" />
        <Row className="host-experience-content-left-item">
          <Col sm={24} xs={24}>
            <Row>
              <h5>Photos</h5>
            </Row>
            <Row className="host-experience-upload">
              <UploadPhoto setImages={setImages} images={images} />
            </Row>
          </Col>
        </Row>
        <Row className="host-experience-content-left-item">
          <Col md={24} sm={24} xs={24}>
            <Row>
              <h5>Title</h5>
            </Row>
            <Row align="middle" justify="start">
              <Col md={24} sm={24} xs={24}>
                <Controller
                  as={<Input placeholder="Enter title" />}
                  name="title"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'You must enter your title',
                    },
                  }}
                />
                {errors.title && (
                  <div className="errorText">{errors.title.message}</div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="host-experience-content-left-item-line" />

        <Row className="host-experience-content-left-item">
          <Col md={24} sm={24} xs={24}>
            <Row>
              <h5>Description</h5>
            </Row>
            <Row align="middle" justify="start">
              <Col md={24} sm={24} xs={24}>
                <Controller
                  as={<TextArea rows={4} placeholder="Enter description" />}
                  name="description"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'You must enter description',
                    },
                  }}
                />
                {errors.description && (
                  <div className="errorText">{errors.description.message}</div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="host-experience-content-left-item-line" />
        <Row className="host-experience-content-left-item">
          <Col md={24} sm={24} xs={24}>
            <Row>
              <h5>Duration (in minutes)</h5>
            </Row>
            <Row align="middle" justify="start">
              <Col md={24} sm={24} xs={24}>
                <Controller
                  as={
                    <InputNumber
                      placeholder="Enter duration"
                      type="number"
                      min={0}
                      parser={(value) => value.replace(/\D/g, '')}
                    />
                  }
                  name="duration"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'You must enter duration',
                    },
                  }}
                />
                {errors.duration && (
                  <div className="errorText">{errors.duration.message}</div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="host-experience-content-left-item-line" />
        <Row className="host-experience-content-left-item">
          <Col md={24} sm={24} xs={24}>
            <Row>
              <h5>Price / Person</h5>
            </Row>
            <Row align="middle" justify="start">
              <Col md={24} sm={24} xs={24}>
                <Controller
                  as={
                    <InputNumber
                      prefix={'$'}
                      placeholder="Enter price / person"
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\D/g, '')}
                    />
                  }
                  name="price"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'You must enter price / person',
                    },
                  }}
                />
                {errors.price && (
                  <div className="errorText">{errors.price.message}</div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="host-experience-content-left-item-line" />
        <Row className="host-experience-content-left-item">
          <Col md={24} sm={24} xs={24}>
            <Row>
              <h5>Category</h5>
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
        </Row>

        {/* <Row className="host-experience-content-left-item">
          <Col md={24} sm={24} xs={24}>
            <Row>
              <h5>Category</h5>
            </Row>
            <Row align="middle" justify="start">
              <Col md={24} sm={24} xs={24}>
                <Controller
                  as={
                    <AutoComplete
                      onSearch={handleSeachCategories}
                      dataSource={categories.map((item) => ({
                        value: item.name,
                        label: item.id,
                      }))}
                    >
                      <Input
                        className="searchlocationbox"
                        prefix={<img src={SearchIcon} alt="" />}
                        placeholder="Search Category"
                      />
                    </AutoComplete>
                  }
                  name="categoryName"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'You must choose category',
                    },
                  }}
                />
                {errors.categoryName && (
                  <div className="errorText">{errors.categoryName.message}</div>
                )}
              </Col>
            </Row>
          </Col>
        </Row> */}
        <Row justify="center">
          <Col md={18} sm={18} xs={18}>
            <Row justify="center" className="create-btn">
              <Button htmlType="submit">Create Experience</Button>
            </Row>
          </Col>
        </Row>
      </form>
    </Col>
  );
};

export default HostExperienceForm;
