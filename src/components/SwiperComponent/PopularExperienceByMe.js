import React from 'react';
import Swiper from 'react-id-swiper';
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Image, Row } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './PopularExperience.scss';

const { Meta } = Card;

const PopularExperienceByMe = ({ data, theme }) => {
  let history = useHistory();
  const title = `${
    data.length > 0 ? `(${data.length}) ` : ''
  }Popular Experiences`;

  const params = {
    slidesPerView: 'auto',
    spaceBetween: 30,
    observer: true,
    observeParents: true,
  };

  const colorDark = theme === 'dark' ? { color: 'black' } : {};

  return (
    <div className='popularExperience'>
      <h2 className='title' style={colorDark}>
        Hosted Experience(s)
      </h2>
      <Swiper {...params}>
        <Link to='/hostexperience'>
          <div
            style={{
              background: '#C4C4C4',
              width: 234,
              borderRadius: 8,
              height: 345,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#2A2A29',
            }}
          >
            <AiOutlinePlus style={{ fontSize: 80 }} />
            <div>Host an Experience</div>
          </div>
        </Link>

        {data.map((item, idx) => (
          <div key={item.id}>
            <h3>
              <Card
                className='card-item'
                hoverable
                style={{ width: 232, borderRadius: '18px' }}
                cover={
                  <LazyLoadImage
                    src={item.imgLink}
                    height='100%'
                    width='232'
                    placeholderSrc='image'
                    effect='blur'
                    style={{ borderRadius: 12 }}
                  />
                }
                onClick={() => history.push(`/experience/${item.id}`)}
              >
                <Meta
                  // title={item.title}
                  description={
                    <Row justify='start' align='middle'>
                      <Col sm={24} xs={24}>
                        <Row style={colorDark}>{item.title}</Row>
                        <Row align='middle'>
                          <Col
                            sm={24}
                            xs={24}
                            style={{
                              opacity: 0.75,
                            }}
                          >
                            <span
                              style={{
                                textTransform: 'capitalize',
                                ...colorDark,
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
                              opacity: 0.85,
                              ...colorDark,
                            }}
                          >
                            From {item.price} / person
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  }
                  style={{
                    opacity: 0.85,
                    ...colorDark,
                  }}
                />
              </Card>
            </h3>
          </div>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularExperienceByMe;
