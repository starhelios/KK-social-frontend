import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.scss';
import React, {useState, useEffect} from 'react';
import Slider from 'react-slick';
import { NavLink } from 'react-router-dom';
import moment from 'moment'
import _debounce from "lodash/debounce";
import { toast } from "react-toastify";
import { Button, Card, Col, Image, Row } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import _ from 'lodash'

import {settings, settings_booking} from './SliderSettings'

import _get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import { experienceServices } from '../../../../services/experienceService';


const { Meta } = Card;

function SliderConfirmed(props) {
    const [newHostData, setNewHostData] = useState();
  const { data, rows } = props.data;
  const popular_flag = props.data.flag;
  const header_title = props.data.header_title;
  const card_width = props.data.width;
  const card_height = props.data.height;
  const history = useHistory();

  const font_color = props.data.color === 0 ? 0.25 : '';
  const header_title_color = props.data.color === 0 ? 0.15 : '';
  const header_title_font_size = props.data.color === 0 ? 36.58 : '';

  const nav_link =  '/profile'
  
  const userId = localStorage.getItem('userId');
  const getUserZoomRole = (itemIds) => {
    return itemIds.indexOf(userId) > -1 ? '0': '1'
  }

  const sendUserInfoToZoom = async (specExperienceId, idsArray) => {
    const userRole = getUserZoomRole(idsArray);
    console.log(specExperienceId)
    experienceServices.buildUserZoomExperience(userId, specExperienceId, userRole).then(res => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);
      if (!errorStatus) {
        //TODO event handler once finished sending experience
        const base64Url = Buffer.from(payload.experienceBuilt, 'utf-8').toString('base64');
        console.log(base64Url)
        const buildUrl = `https://kloutkast-zoom.herokuapp.com/${base64Url}`
        toast.success('Re-directing to Zoom');
        const redirect_user = _debounce(() => {
          window.location.href = buildUrl;
        }, 1500);
        redirect_user();
      } else {
        toast.error('Something went wrong')
          console.log("couldn't build experience");
      }
    }
    )}

    const findBookingsWithUsers = (data) => {
        const clonedData = _.cloneDeep(data);
        let experiencesWithUsers = [];
        const promise = new Promise((resolve, reject) => {
            clonedData.map((item, idx) => {
                item.specificExperience.map((itemTwo, idxTwo) => {
                    if(itemTwo.usersGoing && itemTwo.usersGoing.length > 0){  
                       return experiencesWithUsers.push(itemTwo)
                    }
                })
                if(idx === clonedData.length -1){
                    resolve()
                }
            })
        })
        promise.then((res) => {
            return setNewHostData(experiencesWithUsers)
        })
    }

    useEffect(() => {
        setNewHostData()
        findBookingsWithUsers(data);
    }, [data])

    console.log(newHostData)

  

//   console.log(data)

  return (
    <div className='slick-wrapper'>
      {popular_flag > 2 && newHostData ? (
        <Slider {...settings_booking(newHostData, rows, popular_flag)}>
          {newHostData
            ? newHostData.map((item) => {
                return (
                  <div key={item.id}>
                    <h3>
                      <div
                        className='booking-card'
                        style={{
                          width: card_width,
                          height: card_height,
                          background: `url(${item.experience ? item.experience.images[0]: ""}) center center no-repeat`,
                          backgroundSize: 'cover',
                          borderRadius: '18px 18px 18px 18px'
                        }}
                      >
                        {popular_flag < 5 ? (
                          <Row className='card-wrapper' align='bottom'>
                            <Col sm={24} xs={24}>
                              <Row className='booking-card-content'>
                                <Col>
                                  <Row>
                                    <p> {item.experience ? item.experience.title: ""}</p>
                                  </Row>
                                  <Row>
                                    <p>Users Going: {parseInt(item.usersGoing.length)}</p>
                                  </Row>
                                  <Row>
                                    <p>{moment(item.experience.startDay).format('MMMM Do YYYY')} • {item.startTime}</p>
                                  </Row>
                                </Col>
                              </Row>
                              {popular_flag === '3' ? (
                                <Row
                                  className='booking-card-footer'
                                  justify='center'
                                  align='middle'
                                >
                                  <Button onClick={() => sendUserInfoToZoom(item.id, item.usersGoing)}>Join Experience</Button>
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
                                    Experience has ended
                                    
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
          <div>
          {newHostData && newHostData.length && (
              <div>

        <Slider {...settings(newHostData, rows, popular_flag)} className='dashboard-card'>
          {newHostData
            ? newHostData.map((item) => {
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
              </div>
          )}
      </div>
      )}
    </div>
  );
}

export default SliderConfirmed;
