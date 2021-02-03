import './Dashboard.scss';
import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Modal, Slider, DatePicker } from 'antd';
import _get from 'lodash/get';
import { CloseOutlined } from '@ant-design/icons';
import { none } from 'ramda';
import moment from 'moment';
import { useDispatch } from 'react-redux';

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
  const [cityChosen, setCityChosen] = useState(false)
  const [experienceData, setExperienceData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hostData, setHostData] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [valueSearch, setValueSearch] = useState([]);
  const [inputSearch, setInputSearch] = useState([]);
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

      let params = { categoryName: valueSearch, minPrice, maxPrice, location: query };

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
        .filterExperience({ categoryName: valueSearch, startDay, endDay })
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
      setInputSearch([...valueSearch, value].join(', '));
      setValueSearch([...valueSearch, value]);

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
    }
  };

  const handleInputChange = ({ target: { value } }) => {
    return;
    // setValueSearch(value);
  };
  const getAllExperience = async () => {
    experienceServices.getAll().then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);
      console.log(payload);
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
      console.log(res);
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);

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
            <Col md={24} sm={24} xs={24}>
              <Input.Search
                className="searchbox"
                prefix={<img src={SearchIcon} alt="" />}
                placeholder="Search KloutKast"
                onSearch={() => handleShowModal(true)}
                onChange={handleInputChange}
                value={inputSearch}
                enterButton={
                  <Button>
                    <img src={SearchSettingIcon} alt="" />
                  </Button>
                }
              />
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
          </Row>
          <Row className="search-values-wrapper" align="top" justify="center">
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
            {categories.map((item) => (
              <Col key={item.id}>
                <button
                  className="search-values btn-border-white"
                  onClick={() => handleSelectCategory(item.name)}
                >
                  {item.name}
                </button>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row justify="end">
        <Col md={23} xs={23} sm={23}>
          <Row className="experiences-wrapper">
            <Col>
              <PopularExperience
                data={experienceData}
                filterApplied={isFilterActive}
                clearFilters={handleClearFilters}
                title={`${
                  experienceData.length > 0
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
