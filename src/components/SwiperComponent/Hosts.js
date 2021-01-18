import React from 'react';
import Swiper from 'react-id-swiper';
import { NavLink, useHistory } from 'react-router-dom';
import { Card, Avatar, Image, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './PopularExperience.scss';

const params = {
  slidesPerView: 'auto',
  spaceBetween: 30,
  observer: true,
  observeParents: true,
};

const { Meta } = Card;

const Hosts = ({ data }) => {
  const title = `Popular Hosts`;
  let history = useHistory();

  return (
    <div className='popularExperience'>
      <h2 className='title'>{title}</h2>

      <Swiper {...params}>
        {data.map((item, idx) => (
          <div key={item.id}>
            <h3>
              <Card
                className='card-item'
                hoverable
                style={{ width: 232, borderRadius: '18%' }}
                cover={
                  item.avatarUrl ? (
                    <LazyLoadImage
                      src={item.avatarUrl}
                      height='100%'
                      width='232'
                      placeholderSrc='image'
                      effect='blur'
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <Avatar size={225} icon={<UserOutlined />} />
                  )
                }
                onClick={() => history.push(`/hostdetails/${item.id}`)}
              >
                <Meta
                  title={item.title}
                  description={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                      }}
                    >
                      <div>{item.fullname}</div>
                      <div>{item.categoryName}</div>
                    </div>
                  }
                  style={{
                    opacity: 0.85,
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

export default Hosts;
