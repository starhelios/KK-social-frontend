import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SliderComponent.scss';
import React from 'react';
import Slider from 'react-slick';
import { NavLink } from 'react-router-dom';
import { Button, Card, Col, Image, Row } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import RatingComponent from './RatingComponent';
import { experienceServices } from '../../services/experienceService';


const { Meta } = Card;

function SliderComponent(props) {
  const dispatch = useDispatch();
  const { data, rows } = props.data;
  const popular_flag = props.data.flag;
  const header_title = props.data.header_title;
  const card_width = props.data.width;
  const card_height = props.data.height;

  const font_color = props.data.color === 0 ? 0.25 : '';
  const header_title_color = props.data.color === 0 ? 0.15 : '';
  const header_title_font_size = props.data.color === 0 ? 36.58 : '';

  const nav_link = props.data.flag === 1 ? '/experience' : '/hostdetails';

  const getNumOfItemsToShow = (size) => {
    return size === 'xsmall'
      ? 2
      : size === 'small'
      ? 3
      : size === 'medium'
      ? 4
      : 5;
  };

  const sendRatingData = (experienceId, rating) => {
    const userId = localStorage.getItem('userId');
    console.log('send rating data', experienceId, rating, userId);
    if (experienceId && rating && userId) {
            experienceServices.rateSpecificExperience(experienceId, rating, userId).then((res) => {
                
            const { data } = res;
            const errorStatus = _get(data, 'error.status', true);
            const payload = _get(data, 'payload', null);
            if (!errorStatus) {
                //TODO event handler once finished sending experience

            } else {
                console.log("couldn't go through bookings");
            }
            });
        } else {
            console.log('user not logged in')
        //   dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
        //   history.push('/');
        }
  }

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: data.length >= 5,
    centerPadding: '-10px',
    slidesToShow: 5,
    rows: rows,
    speed: 500,
    slidesPerRow: 1,
    initialSlide: 0,
    nextArrow: <RightOutlined />,
    prevArrow: <LeftOutlined />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          infinite: data.length > 3,
          centerPadding: '60px',
          centerMode: true,
          initialSlide: 0,
          // slidesToScroll: 3,
          // infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: data.length > 3,
          centerPadding: '60px',
          // slidesToScroll: 3,
          // infinite: true,
          // dots: true
          initialSlide: 5,
        },
      },
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 2,
          initialSlide: 0,
          infinite: data.length > 3,
          centerPadding: '60px',
          // slidesToScroll: 2,
          // initialSlide: 2
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          centerPadding: '150px',
          infinite: data.length > 3,
          // slidesToScroll: 1
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          infinite: data.length > 3,
          centerPadding: '140px',
          //centerMode: false
          // slidesToScroll: 1
        },
      },
      {
        breakpoint: 582,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          infinite: data.length > 3,
          centerPadding: '130px',
          //centerMode: false
          // slidesToScroll: 1
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          infinite: data.length > 3,
          centerPadding: '120px',
          //centerMode: false
          // slidesToScroll: 1
        },
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          infinite: data.length > 3,
          centerPadding: '100px',
          centerMode: false,
          // slidesToScroll: 1
        },
      },
    ],
     draggable: true,
    swipeToSlide: true
  };
  const settings_booking = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: popular_flag === 5 ? '300px' : '-80px',
    slidesToShow: popular_flag === 5 ? 3 : 5,
    rows: rows,
    speed: 500,
    initialSlide: 0,
    nextArrow: <RightOutlined />,
    prevArrow: <LeftOutlined />,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: popular_flag === 5 ? 3 : 4,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '100px' : '100px',
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '70px' : '100px',
        },
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '10px' : '100px',
        },
      },
      {
        breakpoint: 1342,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '100px' : '200px',
        },
      },
      {
        breakpoint: 1168,
        settings: {
          slidesToShow: 2,
          centerPadding: popular_flag === 5 ? '90px' : '180px',
          infinite: data.length > 3,
        },
      },
      {
        breakpoint: 1110,
        settings: {
          slidesToShow: 2,
          centerPadding: popular_flag === 5 ? '30px' : '150px',
          infinite: data.length > 3,
        },
      },
      {
        breakpoint: 1054,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '10px' : '100px',
        },
      },
      {
        breakpoint: 940,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '10px' : '80px',
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '-100px' : '50px',
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '-50px' : '40px',
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '-60px' : '30px',
        },
      },
      {
        breakpoint: 783,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '-60px' : '25px',
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '100px' : '150px',
          initialSlide: 0,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '80px' : '120px',
        },
      },
      {
        breakpoint: 620,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '50px' : '100px',
        },
      },
      {
        breakpoint: 570,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '30px' : '70px',
        },
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? '10px' : '50px',
        },
      },
      {
        breakpoint: 478,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          infinite: data.length > 3,
          centerPadding: '100px',
          centerMode: false,
        },
      },
    ],
    draggable: true,
    swipeToSlide: true
  };

  console.log(data)
  const findRating = (item) => {
    const userId = localStorage.getItem('userId');
    console.log(item);
    let obj;
    item.ratings.map((item, idx) => {
      const array = Object.values(item);
      if(array.indexOf(item.id) > -1 && array.indexOf(userId) > -1){
        return obj = item;
      }else {
        return false
      }
    })
    return obj.rating;
  }

  return (
    <div className='slick-wrapper'>
      {popular_flag < 3 ? (
        <h2
          style={{
            filter: 'brightness(' + header_title_color + ')',
            fontSize: header_title_font_size,
          }}
        >
          {header_title}
        </h2>
      ) : (
        ''
      )}

      {popular_flag > 2 ? (
        <Slider {...settings_booking}>
          {data
            ? data.map((item) => {
                return (
                  <div key={item.id}>
                    <h3>
                      <div
                        className='booking-card'
                        style={{
                          width: card_width,
                          height: card_height,
                          background: `url(${item.experience ? item.experience.images[0]: null}) center center no-repeat`,
                          backgroundSize: 'cover',
                          borderRadius: '18px 18px 18px 18px'
                        }}
                      >{console.log(item.imageUrl)}
                        {popular_flag < 5 ? (
                          <Row className='card-wrapper' align='bottom'>
                            <Col sm={24} xs={24}>
                              <Row className='booking-card-content'>
                                <Col>
                                  <Row>
                                    <p> {item.experience ? item.experience.title: null}</p>
                                  </Row>
                                  <Row>
                                    <p> {item.day} • {item.startTime}</p>
                                  </Row>
                                </Col>
                              </Row>
                              {popular_flag === '3' ? (
                                <Row
                                  className='booking-card-footer'
                                  justify='center'
                                  align='middle'
                                >
                                  <Button>Join Experience</Button>
                                </Row>
                              ) : (
                                <Row
                                  className='booking-card-footer-rate'
                                  justify='start'
                                  align='middle'
                                >
                                  <Col
                                    md={24}
                                    className='booking-card-footer-rate-col'
                                  >
                                    <Row>
                                      <p> Rate this experience:</p>
                                    </Row>
                                    <Row>
                                      <RatingComponent id={item.id} callback={sendRatingData} rated={findRating(item)} />
                                    </Row>
                                  </Col>
                                </Row>
                              )}
                            </Col>
                          </Row>
                        ) : (
                          ''
                        )}
                      </div>
                    </h3>
                  </div>
                );
              })
            : ''}
        </Slider>
      ) : (
        <Slider {...settings} className='dashboard-card'>
          {data
            ? data.map((item) => {
                return (
                  <div key={item.id}>
                    <h3>
                      <NavLink exact to={nav_link}>
                        <Card
                          className='card-item'
                          hoverable
                          style={{ width: card_width, borderRadius: '18px' }}
                          cover={<img alt='example' src={item.imgLink} />}
                        >
                          {popular_flag === 1 ? (
                            <Meta
                              title={item.title}
                              description={
                                <Row justify='start' align='middle'>
                                  <Col sm={24} xs={24}>
                                    <Row align='middle'>
                                      {/* <Col sm={3} xs={3}><Row align="middle">{<Image src={item.catoryIcon} style={{filter:"brightness("+ font_color +")", opacity:0.75 }}/>}</Row></Col> */}
                                      <Col
                                        sm={24}
                                        xs={24}
                                        style={{
                                          filter:
                                            'brightness(' + font_color + ')',
                                          opacity: 0.75,
                                        }}
                                      >
                                        <span
                                          style={{
                                            textTransform: 'capitalize',
                                          }}
                                        >
                                          {item.category}
                                        </span>
                                        {item.time ? ` • ${item.time}` : ``}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col
                                        style={{
                                          filter:
                                            'brightness(' +
                                            props.data.color +
                                            ')',
                                          opacity: 0.85,
                                        }}
                                      >
                                        {' '}
                                        From {item.price} / person
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              }
                              style={{
                                filter: 'brightness(' + props.data.color + ')',
                                opacity: 0.85,
                              }}
                            />
                          ) : (
                            <Meta
                              title={item.title}
                              description={
                                <>
                                  <p>
                                    {<Image src={item.catoryIcon} />}{' '}
                                    <span style={{ margin: '0px 0px 8px 8px' }}>
                                      {item.category}
                                      {item.time ? ` • ${item.time}` : ``}
                                    </span>
                                  </p>
                                </>
                              }
                              style={{ textAlign: 'center' }}
                            />
                          )}
                        </Card>
                      </NavLink>
                    </h3>
                  </div>
                );
              })
            : ''}
        </Slider>
      )}
    </div>
  );
}

export default SliderComponent;
