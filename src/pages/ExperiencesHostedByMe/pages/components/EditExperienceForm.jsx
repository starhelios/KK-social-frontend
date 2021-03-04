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
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';


import UploadPhoto from '../../../../components/UploadPhoto/UploadPhoto';
import { categoryServices } from '../../../../services/categoryService';
import { experienceServices } from '../../../../services/experienceService';
import { formatDateBE } from '../../../../utils/utils';

const { TextArea } = Input;

const EditExperienceForm = ({experience, days}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { register, handleSubmit, errors, control, setValue, watch } = useForm();
  const [images, setImages] = useState([]);
  const history = useHistory();

//   const price = watch('price');

//   useEffect(() => {
//     setPrice(price);
//   }, [price]);

  useEffect(() => {
    setValue('title', experience.title, {shouldDirty: true})
    setValue('description', experience.description, {shouldDirty: true})
    setValue('duration', experience.duration, {shouldDirty: true})
    setValue('price', experience.price, {shouldDirty: true})

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

//   const handleSeachCategories = useCallback(_debounce(callApiSearch, 1000), []);
  const onSubmit = (value) => {
    if (images.length === 0) {
      toast.error('Please upload photos');
      return;
    }

    
    let specificExperiences = [];
    let clonedExperience = _.cloneDeep(experience);
    clonedExperience.images = images;
    clonedExperience.specificExperience = days;

    days.forEach((element, idx) => {
      const startTime = element.startTime;
      const endTime = element.endTime;
      const day = element.day
      element.imageUrl = images[0]
      let difference = parseInt(moment.duration(moment(day+ " " + endTime).diff(moment(day + " " + startTime))).asMinutes());
      if(difference >= (experience.duration * 2)){
        for(let i = 0; i < (difference / experience.duration); i++){
          let object = _.cloneDeep(element);
          let newStartTime = moment(day + " " + startTime).add(experience.duration * i, 'minutes').format('LT');
          let newEndTime = moment(day + " " + startTime).add(experience.duration * i + experience.duration, 'minutes').format('LT');
          object.startTime = newStartTime;
          object.endTime = newEndTime;
          delete object["id"]
          specificExperiences.push(object);
        }
      }else {
        specificExperiences.push(element)
      }
    })

    let params = {
      ...value,
      specificExperiences,
      images,
      duration: value.duration,
      price: value.price,
      startDay: moment(experience.specificExperience[0].day).format(formatDateBE),
      endDay: moment(experience.specificExperience[experience.specificExperience.length - 1].day).format(),
      categoryName: !selectedCategory ? experience.categoryName : selectedCategory.name,
    };

    console.log('params found here',params)

    experienceServices.updateExperience(params).then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const errorMessage = _get(data, 'error.message', '');
      const payload = _get(data, 'payload', null);

      if (!errorStatus) {
        toast.success('Host an experience success!');
        const redirect_user = _debounce(() => {
          history.push('/experiences-hosted-by-me');
        }, 1500);
        redirect_user();
      } else {
        console.log(errorMessage)
        toast.error("Something went wrong. Try again later.");
      }
    });
  };

  const showDropDownMenu = () => {
    return (
      <Menu>
        {categories.map((elem, index) => {
            console.log(elem)
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
  console.log(experience)
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
              <UploadPhoto setImages={setImages} images={images} propImages={experience.images} />
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
              <Col style={{cursor: 'pointer'}} md={24} sm={24} xs={24}>
                <Dropdown overlay={showDropDownMenu} trigger={['click']}>
                  <p style={{ fontSize: '20px' }}>{`${
                    !selectedCategory ? experience.categoryName : selectedCategory.name
                  }`}</p>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="center">
          <Col md={18} sm={18} xs={18}>
            <Row justify="center" className="create-btn">
              <Button htmlType="submit">Save Experience</Button>
            </Row>
          </Col>
        </Row>
      </form>
    </Col>
  );
};

export default EditExperienceForm;
