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
import _, { times } from 'lodash';
import moment from 'moment';


import UploadPhoto from '../../../../components/UploadPhoto/UploadPhoto';
import { categoryServices } from '../../../../services/categoryService';
import { experienceServices } from '../../../../services/experienceService';
import { formatDateBE } from '../../../../utils/utils';

const { TextArea } = Input;

const EditExperienceForm = ({ experience, days, unEditableExperiences }) => {
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
    setValue('title', experience.title, { shouldDirty: true })
    setValue('description', experience.description, { shouldDirty: true })
    setValue('duration', experience.duration, { shouldDirty: true })
    setValue('price', experience.price, { shouldDirty: true })

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

    //TODO: check for overlapping experiences
    console.log(days)
    console.log(experience.specificExperience)
    const concatArrayOfExperiences = days.concat(unEditableExperiences)
    console.log(concatArrayOfExperiences);
    let specificExperiences = [];
    concatArrayOfExperiences.forEach((element, idx) => {
      console.log('element...', element)
      const startTime = element.startTime;
      const endTime = element.endTime;
      const day = element.day
      element.imageUrl = images[0]
      let difference = parseInt(moment.duration(moment(day + " " + endTime).diff(moment(day + " " + startTime))).asMinutes());
      if (difference >= (experience.duration * 2)) {
        for (let i = 0; i < (difference / experience.duration); i++) {
          let object = _.cloneDeep(element);
          let newStartTime = moment(day + " " + startTime).add(experience.duration * i, 'minutes').format('LT');
          let newEndTime = moment(day + " " + startTime).add(experience.duration * i + experience.duration, 'minutes').format('LT');
          object.startTime = newStartTime;
          object.endTime = newEndTime;
          delete object["id"]
          if (newEndTime <= endTime)
            specificExperiences.push(object);
        }
      } else {
        let newElement = element;
        let newEndTime = moment(day + " " + startTime).add(value.duration, 'minutes').format('LT');
        newElement.endTime = newEndTime
        specificExperiences.push(newElement)
      }
    })
    console.log(specificExperiences)
    //!this is correct so far...
    const dateFormat = '' // defaults to isoString. Check moment js docs
    const getOverlappedTimes = (originalStartTime, originalEndTime, arrayStartTime, arrayEndTime) => {
      //TODO: Check if the days are the same first then validate
      const startTime = moment(originalStartTime, dateFormat);
      const endTime = moment(originalEndTime, dateFormat);
      const arrayStart = moment(arrayStartTime, dateFormat);
      const arrayEnd = moment(arrayEndTime, dateFormat);

      if (startTime.isBetween(arrayStart, arrayEnd) || endTime.isBetween(arrayStart, arrayEnd)) {
        return false;
      } else {
        return true;
      }
    }
    const validate = (sTime, eTime, array, idx) => {
      const clonedArray = _.cloneDeep(array);
      clonedArray.splice(idx, 1)
      return clonedArray.map((item, idx) => {
        const arrayStartTime = moment(item.day + " " + item.startTime).format();
        const arrayEndTime = moment(item.day + " " + item.endTime).format();
        const originalStartTime = sTime;
        const originalEndTime = eTime;
        if (moment(originalStartTime).format("MMM Do YY") === moment(arrayStartTime).format("MMM Do YY")) {
          // console.log('comparing...', moment(originalStartTime).format("MMM Do YY") + " " + moment(arrayStartTime).format("MMM Do YY"))

          return getOverlappedTimes(originalStartTime, originalEndTime, arrayStartTime, arrayEndTime);

          // console.log(getOverlap)
        }
      })
    }
    const truth = specificExperiences.map((experience, idx) => {
      return validate(moment(experience.day + " " + experience.startTime).format(), moment(experience.day + " " + experience.endTime).format(), specificExperiences, idx)
    })
    const data = _.flattenDeep(truth).filter((element, idx) => {
      return element !== undefined
    })
    if (data.indexOf(false) !== -1) {
      toast.error("Your new edited experience overlap existing ones. Please try again!")
      return false
    }

    const uniqueArray = specificExperiences.filter((v, i, a) => a.findIndex(t => (t.day.toLowerCase() === v.day.toLowerCase() && t.startTime.toLowerCase() === v.startTime.toLowerCase())) === i)
    console.log(uniqueArray)
    //!this is correct so far...

    let params = {
      ...value,
      id: experience.id,
      specificExperiences: uniqueArray,
      images,
      duration: value.duration,
      price: value.price,
      startDay: moment(experience.specificExperience[0].day).format(formatDateBE),
      endDay: moment(experience.specificExperience[experience.specificExperience.length - 1].day).format(),
      categoryName: !selectedCategory ? experience.categoryName : selectedCategory.name,
    };
    console.log(params);
    // return false;

    experienceServices.updateExperience(params).then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const errorMessage = _get(data, 'error.message', '');
      const payload = _get(data, 'payload', null);

      if (!errorStatus) {
        toast.success('Host an experience success!');
        // const redirect_user = _debounce(() => {
        //   history.push('/experiences-hosted-by-me');
        // }, 1500);
        // redirect_user();
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
          <h1 style={{ color: "#0A0A0A" }}>Host an Experience</h1>
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
                    min: {
                      value: 20,
                      message: "Price / person must be greater than $20"
                    }
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
              <Col style={{ cursor: 'pointer' }} md={24} sm={24} xs={24}>
                <Dropdown overlay={showDropDownMenu} trigger={['click']}>
                  <p style={{ fontSize: '20px' }}>{`${!selectedCategory ? experience.categoryName : selectedCategory.name
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
