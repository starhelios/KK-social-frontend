import './Dashboard.scss';
import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Modal, Slider, DatePicker } from 'antd';
import _get from 'lodash/get';
import { CloseOutlined } from '@ant-design/icons';
import { none } from 'ramda';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Swiper from "react-id-swiper";

import SearchSettingIcon from '../../assets/img/search-setting-icon.png';
import SearchIcon from '../../assets/img/search-icon.png';
import { experienceServices } from '../../services/experienceService';
import { convertExperience, formatDateBE } from '../../utils/utils';
import { categoryServices } from '../../services/categoryService';
import ApplyFilterModal from './ApplyFilterModal';
import PopularExperience from '../../components/SwiperComponent/PopularExperience';
import { authServices } from '../../services/authServices';
import Hosts from '../../components/SwiperComponent/Hosts';
import { EXPERIENCE_SET_DATE_FILTER } from '../../redux/types/experienceTypes';

const { RangePicker } = DatePicker;

function Dashboard() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('')
  const [modalState, setModalState] = useState(false)
  const [cityChosen, setCityChosen] = useState(false)
  const [experienceData, setExperienceData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hostData, setHostData] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [valueSearch, setValueSearch] = useState([]);
  const [inputSearch, setInputSearch] = useState([]);
  const [inputValues, setInputValues] = useState("");
  const [values, setValues] = useState([]);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [rangeData, setRangeData] = useState([20, 800]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [dateSelectedText, setDateSelectedText] = useState('');

  const handleShowModal = (value) => {
    setShowFilterModal(value);
  };

  const handleClearFilters = () => {
    // setExperienceData([]);
    setInputValues("")
    getAllExperience();
    setValueSearch([]);
    setInputSearch([]);
    setRangeData([20, 800]);
    setDateSelectedText('');
    setIsFilterActive(false);
  };

  const handleApplyFilters = () => {
    if (rangeData.length > 0) {
      const minPrice = rangeData[0];
      const maxPrice = rangeData[1];

      let params = { categoryName: inputValues, minPrice, maxPrice, location: query };

      if (values.length > 0) {
        params.startDay = moment(values[0]).format(formatDateBE);
        params.endDay = moment(values[1]).format(formatDateBE);
      }

      experienceServices.filterExperience(params).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);

        if (!errorStatus) {
          const result = convertExperience(payload);

          setExperienceData(result);
        }
      });
    }
    handleShowModal(false);
    setIsFilterActive(true);
  };

  const handleSliderChange = (value) => {
    setRangeData(value);
  };

  const handleSliderAfterChange = (value) => {
    console.log('price after change: ', value);
  };

  const handleShowDatepicker = (value) => {
    setShowDatepicker(value);
  };

  const handleApplyDatepicker = () => {
    if (values.length > 0) {
      handleShowDatepicker(false);

      const startDay = moment(values[0]).format(formatDateBE);
      const endDay = moment(values[1]).format(formatDateBE);

      dispatch({
        type: EXPERIENCE_SET_DATE_FILTER,
        payload: {
          startDate: startDay,
          endDate: endDay,
        },
      });

      setDateSelectedText(
        `${moment(startDay).format('MMM DD')} - ${moment(endDay).format(
          'MMM DD'
        )}`
      );

      experienceServices
        .filterExperience({ categoryName: inputValues, startDay, endDay })
        .then((res) => {
          const { data } = res;
          const errorStatus = _get(data, 'error.status', true);
          const payload = _get(data, 'payload', null);

          if (!errorStatus) {
            const result = convertExperience(payload);

            setExperienceData(result);
          }
        });
    }
  };
  const handleChange = (values) => {
    setValues(values);
  };

  const handleOpenChange = () => {
    handleShowDatepicker(true);
  };

  const handleSelectCategory = (value) => {
    if (!valueSearch.includes(value)) {
      const newArrayInput = [...inputSearch];
      const newArrayValue = [...valueSearch];
      newArrayInput.push(value);
      newArrayValue.push(value);
      setInputSearch(newArrayInput);
      setValueSearch(newArrayValue);
      console.log('running category search')
      experienceServices
        .filterExperience({ categoryName: [...valueSearch, value] })
        .then((res) => {
          const { data } = res;
          const errorStatus = _get(data, 'error.status', true);
          const payload = _get(data, 'payload', null);

          if (!errorStatus) {
            const result = convertExperience(payload);

            setExperienceData(result);
          }
        });
    } else {
      const array = [...inputSearch]
      const index = array.indexOf(value);
      array.splice(index, 1)
      setInputSearch(array);
      setValueSearch(array);
      experienceServices
        .filterExperience({ categoryName: [...array] })
        .then((res) => {
          const { data } = res;
          const errorStatus = _get(data, 'error.status', true);
          const payload = _get(data, 'payload', null);

          if (!errorStatus) {
            const result = convertExperience(payload);

            setExperienceData(result);
          }
        });
    }
  };

  const handleInputChange = ({ target: { value } }) => {
    setInputValues(value)
    experienceServices.filterExperience({ searchText: value}).then((res) => {
      const { data } = res;
          const errorStatus = _get(data, 'error.status', true);
          const payload = _get(data, 'payload', null);
          if(!errorStatus) {
            console.log(payload)
            const result = convertExperience(payload.experiences);
            if(value.length === 0){
              authServices.getHosts().then((res) => {
                const { data } = res;
                const errorStatus = _get(data, 'error.status', true);
                const payload = _get(data, 'payload', null);
                console.log(payload)
                if (!errorStatus) {
                  setHostData(payload.results);
                }
              });
            }else {

              setHostData(payload.users)
            }
            setExperienceData(result);
          }
    })
  };
  const getAllExperience = async () => {
    experienceServices.getAll().then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);
      if (!errorStatus) {
        const result = convertExperience(payload);

        setExperienceData(result);
      }
    });
  };

  useEffect(() => {
    if (valueSearch.length > 0) {
      setIsFilterActive(true);
    }
  }, [valueSearch]);
  useEffect(() => {
    if (dateSelectedText.length > 0) {
      setIsFilterActive(true);
    }
  }, [dateSelectedText]);
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
  const params = {
    centeredSlides: true,
    resistance: true,
    resistanceRatio: .1,
    slidesPerView: "auto",
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    wrapperClass: "filters-wrapper",
    containerClass: "swiper-container-filters"
  };
  useEffect(() => {
    getAllExperience();
  }, []);
  useEffect(() => {
    // experienceServices.getAll().then((res) => {
    //   const { data } = res;
    //   const errorStatus = _get(data, 'error.status', true);
    //   const payload = _get(data, 'payload', null);

    //   if (!errorStatus) {
    //     const result = convertExperience(payload);

    //     setExperienceData(result);
    //   }
    // });

    // categoryServices.searchCategory('').then((res) => {
    //   const { data } = res;
    //   const errorStatus = _get(data, 'error.status', true);
    //   const payload = _get(data, 'payload', null);

    //   if (!errorStatus) {
    //     setCategories(payload);
    //   }
    // });

    authServices.getHosts().then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);
      console.log(payload)
      if (!errorStatus) {
        setHostData(payload.results);
      }
    });
  }, []);



  return (
    <div className="dashboard-wrapper">
      <Row>
        <Col md={24} sm={24} xs={24}>
          <Row justify="center">
            <Col md={12} sm={16} xs={20}>
              <Input
                className="searchbox"
                prefix={<img style={{ backgroundColor: 'white' }} src={SearchIcon} alt="" />}
                onSearch={() => handleShowModal(true)}
                onFocus={() => document.getElementById('kloutkast-placeholder').style.display = 'none'}
                onBlur={() => {
                  if(!inputValues.length > 0){
                    document.getElementById('kloutkast-placeholder').style.display = 'block'
                  }
                }}
                style={{ borderRadius: '50px' }}
                onChange={handleInputChange}
                value={inputValues}
                suffix={
                  <Button onClick={() => setShowFilterModal(!showFilterModal)} style={{ marginRight: '10px', backgroundColor: "#2B2B29", height: '80%', width: '100%', borderRadius: '20px' }}>
                    <img style={{ padding: '10px' }} src={SearchSettingIcon} alt="" />
                  </Button>
                }
              />
              <div id="kloutkast-placeholder">Search <span>KloutKast</span></div>
              <Col md={12} sm={16}>
                <ApplyFilterModal
                  query={query}
                  setQuery={setQuery}
                  cityChosen={cityChosen}
                  setCityChosen={setCityChosen}
                  showFilterModal={showFilterModal}
                  handleShowModal={handleShowModal}
                  handleApplyFilters={handleApplyFilters}
                  handleSliderChange={handleSliderChange}
                  handleSliderAfterChange={handleSliderAfterChange}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                />
              </Col>

            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col style={{width: '100%'}}>
          <Row className="search-values-wrapper">
              <Col className="dates-wrapper-col">
                <button className="search-values btn-border-white">
                  <RangePicker
                    className="search-dates"
                    allowClear={true}
                    suffixIcon={none}
                    separator={dateSelectedText || 'Dates'}
                    bordered={false}
                    onOpenChange={handleOpenChange}
                    onChange={handleChange}
                    open={showDatepicker}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '0', paddingLeft: '0' }}
                    renderExtraFooter={() => {
                      return (
                        <div>
                          <Row
                            className="datepicker-header"
                            justify="end"
                            align="middle"
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
                            className="datapicker-footer-apply-btn"
                            justify="center"
                          >
                            <Button onClick={handleApplyDatepicker}>Apply</Button>
                          </Row>
                        </div>
                      );
                    }}
                  />
                </button>
              </Col>
            <Col className="between-line"></Col>
            {categories.map((item, idx) => (
              <Col key={item.id} style={idx === categories.length -1 ? {marginBottom: '25px'}: {}}>
                <button
                  className="search-values btn-border-white"
                  style={inputSearch.indexOf(item.name) > -1 ? { backgroundColor: 'white', color: 'black', width: '140px', height: '50px' } : { width: '140px', height: '50px' }}
                  onClick={() => handleSelectCategory(item.name)}
                >
                  {item.name}
                </button>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col md={23} xs={23} sm={23}>
          <Row className="experiences-wrapper">
            <Col>
              <PopularExperience
                data={experienceData}
                valueSearch={valueSearch}
                filterApplied={isFilterActive}
                clearFilters={handleClearFilters}
                title={`${experienceData.length > 0
                    ? `(${experienceData.length}) `
                    : '(0) '
                  }Popular Experiences`}
              />
            </Col>
          </Row>

          <Row className="hosts-wrapper">
            <Col>
              <Hosts data={hostData} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
