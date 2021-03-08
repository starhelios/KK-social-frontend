import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useHistory, useLocation } from 'react-router-dom';
import Swiper from 'react-id-swiper';

import { Row, Col, Button, DatePicker, Rate } from 'antd';
import {
  ClockCircleOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import Avatar from 'antd/lib/avatar/avatar';
import { useSelector } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { none } from 'ramda';
import { toast } from 'react-toastify';

import ReviewIcon from '../../assets/img/experience/review-star';
import avatar_img from '../../assets/img/avatar.jpg';

import './MyExperiences.scss';
import ConfirmPayModal from './ConfirmPayModal';
import { experienceServices } from '../../services/experienceService';
import {
  formatMinutesToHours,
  convertExperience,
  formatDateBE,
} from '../../utils/utils';
import * as globalFunctions from '../../utils/globalFunctions';
import PopularExperience from '../../components/SwiperComponent/PopularExperience';
import {
  getEndDate,
  getStartDate,
} from '../../redux/selectors/experienceSelector';
import { getUserInfo } from '../../redux/selectors/authSelector';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const STRIPE_PK_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PK_KEY);
const NavLinkWithActivation = (props) => (
  <NavLink activeStyle={{ color: 'color' }} {...props} />
  );

const params = {
  slidesPerView: 'auto',
  spaceBetween: 30,
  observer: true,
  observeParents: true,
};

const { RangePicker } = DatePicker;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function MyExperiences(props) {
  const { id } = useParams();

  const [showConfirmAndPayModal, setShowConfirmAndPayModal] = useState(false);
  const history = useHistory();
  let query = useQuery();
  const [guest_number, setGuestNumber] = useState(1);
  const [detailData, setDetailData] = useState({});
  const [fullname, setFullName] = useState('');
  const [aboutMe, setAboutme] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [experienceData, setExperienceData] = useState([]);
  const [imageUrl, setImageUrl] = useState("")
  const [dateTextFilter, setDateTextFilter] = useState('Dates');
  const [startDateCalendar, setStartDateCalendar] = useState('');
  const [endDateCalendar, setEndDateCalendar] = useState('');
  const [selectedItemInfo, setSelectedItemInfo] = useState(null);
  const [formattedEventsData, setFormattedEventsData] = useState([]);
  const userInfoSelector = useSelector((state) => getUserInfo(state));
  const startDate = useSelector((state) => getStartDate(state));
  const endDate = useSelector((state) => getEndDate(state));
  const [ratingsTotal, setRatingsTotal] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);

  const [showDatepicker, setShowDatepicker] = useState(false);
  const [values, setValues] = useState([]);

  // console.log(experienceData)

  useEffect(() => {
    const data  = Object.values(detailData).length;
    let ratingsCount = 0;
    let ratingsTotal = 0;
    if(data){
      const promise = new Promise((resolve, reject) => {

        detailData.specificExperience.map((item, idx) => {
          if(item.ratings.length){
  
            item.ratings.forEach((element) => {
              ratingsTotal += element.rating;
              return ratingsCount++;
            })
          }
          if(idx === detailData.specificExperience.length -1) {
            resolve();
          }
        })
      })
      promise.then(() => {
        setRatingsCount(ratingsCount);
        setRatingsTotal(ratingsTotal);
      })
    }
  }, [detailData])

  useEffect(() => {
    if (query.get('start_date') && query.get('end_date')) {
      let start_momentObject = moment(query.get('start_date'), formatDateBE);
      let end_momentObject = moment(query.get('end_date'), formatDateBE);
      setValues([start_momentObject, end_momentObject]);
      handleApplyDatepicker();
    }
  }, [detailData]);

  useEffect(() => {
    if (detailData.specificExperience) {
      const formatArr = detailData.specificExperience.map((item, idx) => {
        console.log(item.day)
        if (startDateCalendar && endDateCalendar) {
          if (startDateCalendar === endDateCalendar) {
            const date = moment(new Date(item.day)).format(formatDateBE);

            const check = moment(date).isSame(startDateCalendar);
            if (!check) {
              return null;
            }
          } else {
            const date = moment(new Date(item.day)).format(formatDateBE);

            const result = moment(date).isBetween(
              startDateCalendar,
              endDateCalendar,
              undefined,
              '[]'
            );

            if (!result) {
              return null;
            }
          }
        } else {
          if (!startDate && !endDate) {
            const date = moment(new Date(item.day)).format('DD.MM.YYYY');
            const now = moment().format('DD.MM.YYYY');

            if (date !== now) {
              return null;
            }
          } else {
            if (startDate === endDate) {
              const date = moment(new Date(item.day)).format(formatDateBE);

              const check = moment(date).isSame(startDate);

              if (!check) {
                return null;
              }
            } else {
              const date = moment(new Date(item.day)).format(formatDateBE);

              const result = moment(date).isBetween(
                startDate,
                endDate,
                undefined,
                '[]'
              );

              if (!result) {
                return null;
              }
            }
          }
        }

        return (
          <Col sm={24} xs={24} key={idx}>
            <Row className="exp-content-right-body-row-choose-item-line" />
            <Row
              className="exp-content-right-body-row-choose-item"
              align="middle"
            >
              <Col sm={14} xs={14}>
                <h5>{item.day}</h5>
                <h5>{`${item.startTime} - ${item.endTime} (EDT)`}</h5>
                <h5>${detailData.price} / person</h5>
              </Col>
              <Col sm={10} xs={10}>
                <Row justify="end">
                  <Button
                    className="exp-content-right-body-row-choose-item-btn"
                    onClick={() => {
                      if (localStorage.getItem('userId')) {
                        handleConfirmAndPayModal(true, item, item.id);
                      } else {
                        window.scrollTo(0, 0);
                        toast.error('please login to continue');
                      }
                    }}
                  >
                    Choose
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        );
      });
      var filtered = formatArr.filter(function (el) {
        return el != null;
      });
      setFormattedEventsData(filtered);
    }
  }, [
    detailData,
    values,
    startDateCalendar,
    endDate,
    endDateCalendar,
    startDate,
  ]);
  console.log(detailData.id)
  useEffect(() => {
    if (id) {
      experienceServices.getById(id).then((res) => {
        const { data } = res;
        const errorStatus = _get(data, 'error.status', true);
        const payload = _get(data, 'payload', null);
        if (!errorStatus) {
          if (!startDate && !endDate) {
            setDateTextFilter(`${moment().format('MMM DD')}`);
          } else {
            const check = moment(endDate).isAfter(
              moment().format(formatDateBE)
            );

            if (check) {
              setDateTextFilter(
                `${moment(startDate).format('MMM DD')} - ${moment(
                  endDate
                ).format('MMM DD')}`
              );
            } else {
              setDateTextFilter(
                `${moment().format('MMM DD')} - ${moment(endDate).format(
                  'MMM DD'
                )}`
              );
            }
          }
          setDetailData(payload.experience);
          setFullName(titleCase(payload.experience.hostData.fullname));
          setAboutme(payload.aboutMe);
          setAvatarUrl(payload.avatarUrl);
          setImageUrl(payload.experience.images[0])

          experienceServices
            .getAllByUserId(payload.experience.userId)
            .then((res) => {
              const { data } = res;
              const errorStatus = _get(data, 'error.status', true);
              const payload = _get(data, 'payload', null);

              if (!errorStatus) {
                const result = convertExperience(payload);
                const finalResult = result.filter((item) => item.id !== id);
                console.log(finalResult)
                setExperienceData(finalResult);
              }
            });
        }
      });
    }
  }, [id]);

  const handleDecreaseButton = () => {
    if (guest_number > 0) {
      setGuestNumber(guest_number - 1);
    }
  };

  const handleIncreaseButton = () => {
    setGuestNumber(guest_number + 1);
  };

  const handleConfirmAndPayModal = (value, item_info, id) => {
    setSelectedItemInfo(item_info);
    setShowConfirmAndPayModal(value);
  };

  const handleConfirmAndPay = (paymentStatus) => {
    if (paymentStatus === 'error') {
      toast.error('Payment failed. Try again later!');
    } else if (paymentStatus === 'success') {
      toast.success('Hurray !! Payment succesful!');
    }
    handleConfirmAndPayModal(false);
  };

  const handleOpenChange = () => {
    handleShowDatepicker(true);
  };

  const handleShowDatepicker = (value) => {
    setShowDatepicker(value);
  };
  const handleChange = (values) => {
    setValues(values);
  };
  const handleApplyDatepicker = () => {
    if (values.length > 0) {
      handleShowDatepicker(false);

      const sDay = moment(values[0]).format(formatDateBE);
      const eDay = moment(values[1]).format(formatDateBE);
      history.push({
        pathname: `/experience/${id}`,
        search: `start_date=${sDay}&end_date=${eDay}`,
      });
      setStartDateCalendar(sDay);
      setEndDateCalendar(eDay);

      const check = moment(eDay).isAfter(moment().format(formatDateBE));

      if (check) {
        setDateTextFilter(
          `${moment(sDay).format('MMM DD')} - ${moment(eDay).format('MMM DD')}`
        );
      } else {
        setDateTextFilter(
          `${moment().format('MMM DD')} - ${moment(eDay).format('MMM DD')}`
        );
      }
    }
  };
  const titleCase = (string) => {
    
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const rating = ratingsTotal > 0 && ratingsCount > 0 ? ratingsTotal / ratingsCount : 0;
  console.log(rating)
  return (
    <>
      <Row justify="end" className="myexperience">
        <Elements stripe={stripePromise}>
          <ConfirmPayModal
          titleCase={titleCase}
            showConfirmAndPayModal={showConfirmAndPayModal}
            setShowConfirmAndPayModal={setShowConfirmAndPayModal}
            handleConfirmAndPay={handleConfirmAndPay}
            handleConfirmAndPayModal={handleConfirmAndPayModal}
            userData={userInfoSelector}
            modalDataToShow={detailData}
            guest_number={guest_number}
            itemInfo={selectedItemInfo}
            imageUrl={imageUrl}
          />
        </Elements>
        <Col md={23} xs={23} sm={23}>
          <Row className="exp-back-btn">
            <NavLinkWithActivation to="/">
              <Col>
                <ArrowLeftOutlined />
                <span className="exp-back-btn-context">
                  Back to experiences
                </span>
              </Col>
            </NavLinkWithActivation>
          </Row>
          <Row className="exp-wrapper">
            <Col>
              <Swiper {...params}>
                {detailData.images &&
                  detailData.images.map((item, idx) => (
                    <div style={{ width: 415, height: 415 }} key={idx}>
                      <img
                        src={item}
                        style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
                      />
                    </div>
                  ))}
              </Swiper>
            </Col>
          </Row>
          <Row className="exp-content">
            <Col md={13} sm={13} xs={23} className="exp-content-left">
              <Row className="exp-content-left-item">
                <h1>{detailData.title ? titleCase(detailData.title): null}</h1>
                <h3>Location: {detailData.location ? detailData.location: "TBA"}</h3>
              </Row>
              <Row className="exp-content-left-item-line" />
              <Row className="exp-content-left-item">
                <Col md={24} sm={24} xs={24}>
                  <Row align="middle">
                    <Col md={18} sm={18} xs={18}>
                      <h2>Hosted by {fullname}</h2>
                    </Col>
                    <Col md={6} sm={6} xs={6}>
                      <Row justify="end">
                        <Avatar size={73.12} src={avatarUrl || avatar_img} />
                      </Row>
                    </Col>
                  </Row>
                  <Row align="middle" justify="start">
                    <Col>
                      <ClockCircleOutlined />
                    </Col>
                    <Col>
                      <h3>{formatMinutesToHours(detailData.duration)}</h3>
                    </Col>
                  </Row>
                  <Row align="middle" justify="start">
                    <Col>
                      {globalFunctions.determineIcon(detailData.categoryName)}
                    </Col>
                    <Col>
                      <h3 style={{ textTransform: 'capitalize' }}>
                        {detailData.categoryName ? titleCase(detailData.categoryName): null}
                      </h3>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="exp-content-left-item-line" />
              <Row className="exp-content-left-item">
                <h2>About The Experience</h2>
                <h4>{detailData.description}</h4>
              </Row>
              <Row className="exp-content-left-item-line" />
              <Row className="exp-content-left-item">
                <Col md={24} sm={24} xs={24}>
                  <Row>
                    <h2>Say Hello! to {fullname}</h2>
                  </Row>
                  <Row align="middle" justify="start">
                    <Col style={{display: 'flex', justify: 'center', alignItems: 'center'}}>
                        <ReviewIcon />
                    </Col>
                    <Col>
                      <h3>{ratingsCount > 0 && ratingsTotal > 0 ? rating.toFixed(1).toString() + " • ": ""}{ratingsCount.toString()} {ratingsCount > 1 || ratingsCount === 0 ? 'Reviews': "Review"}</h3>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '39px' }}>
                    <h3>{aboutMe}</h3>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col
              md={{ span: 9, offset: 1 }}
              sm={{ span: 9, offset: 1 }}
              xs={23}
              className="exp-content-right"
            >
              <Row
                className="exp-content-right-header"
                justify="center"
                align="middle"
              >
                <Col
                  md={9}
                  sm={9}
                  xs={9}
                  className="exp-content-right-header-date"
                >
                  <Row
                    justify="center"
                    align="middle"
                    style={{ height: '100%' }}
                  >
                    <RangePicker
                      className="search-dates-experience"
                      allowClear={true}
                      suffixIcon={none}
                      separator={dateTextFilter}
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
                                <Button
                                  onClick={() => handleShowDatepicker(false)}
                                >
                                  <CloseOutlined />
                                </Button>
                              </Col>
                            </Row>
                            <Row
                              className="datapicker-footer-apply-btn"
                              justify="center"
                            >
                              <Button onClick={handleApplyDatepicker}>
                                Apply
                              </Button>
                            </Row>
                          </div>
                        );
                      }}
                    />
                  </Row>
                </Col>

                <Col md={14} sm={14} xs={14} offset={1}>
                  <Row
                    justify="center"
                    align="middle"
                    className="exp-content-right-header-guest"
                  >
                    <Col md={6} sm={6} xs={6}>
                      <Row justify="start">
                        <Button
                          className="decrease-btn"
                          onClick={handleDecreaseButton}
                        >
                          <Col md={24} sm={24} xs={24}>
                            <Row justify="center">
                              <MinusOutlined />
                            </Row>
                          </Col>
                        </Button>
                      </Row>
                    </Col>
                    <Col md={12} sm={12} xs={12}>
                      <Row justify="center">
                        <span>{guest_number}</span>
                        <span style={{ marginLeft: '6px' }}>guest</span>
                      </Row>
                    </Col>
                    <Col md={6} sm={6} xs={6}>
                      <Row justify="end">
                        <Button
                          className="increase-btn"
                          onClick={handleIncreaseButton}
                        >
                          <Col md={24} sm={24} xs={24}>
                            <Row justify="center">
                              <PlusOutlined />
                            </Row>
                          </Col>
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="exp-content-right-body">
                <Col sm={24} xs={24}>
                  <Row className="exp-content-right-body-row">
                    <Col sm={24} xs={24}>
                      <Row className="exp-content-right-body-row-choose">
                        {formattedEventsData.length > 0 && formattedEventsData}

                        <p>
                          {formattedEventsData.length === 0 &&
                            `No events available for selected dates.`}
                        </p>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          {experienceData.length > 0 && (
            <Row className="experiences-wrapper">
              <Col>
                <PopularExperience
                  data={experienceData}
                  theme="dark"
                  title={`${fullname}'s Experience`}
                  isDetail
                />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
}

export default MyExperiences;
