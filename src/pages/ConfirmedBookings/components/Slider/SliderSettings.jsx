import React from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const settings = (data, rows, popular_flag) => {
  return {
    className: "center",
    centerMode: true,
    infinite: data.length >= 5,
    centerPadding: "-10px",
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
          centerPadding: "60px",
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
          centerPadding: "60px",
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
          centerPadding: "60px",
          // slidesToScroll: 2,
          // initialSlide: 2
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          centerPadding: "150px",
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
          centerPadding: "140px",
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
          centerPadding: "130px",
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
          centerPadding: "120px",
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
          centerPadding: "100px",
          centerMode: false,
          // slidesToScroll: 1
        },
      },
    ],
    draggable: true,
    swipeToSlide: true,
  };
};
const settings_booking = (data, rows, popular_flag) => {
  return {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: popular_flag === 5 ? "300px" : "-80px",
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
          centerPadding: popular_flag === 5 ? "100px" : "100px",
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "70px" : "100px",
        },
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "10px" : "100px",
        },
      },
      {
        breakpoint: 1342,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "100px" : "200px",
        },
      },
      {
        breakpoint: 1168,
        settings: {
          slidesToShow: 2,
          centerPadding: popular_flag === 5 ? "90px" : "180px",
          infinite: data.length > 3,
        },
      },
      {
        breakpoint: 1110,
        settings: {
          slidesToShow: 2,
          centerPadding: popular_flag === 5 ? "30px" : "150px",
          infinite: data.length > 3,
        },
      },
      {
        breakpoint: 1054,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "10px" : "100px",
        },
      },
      {
        breakpoint: 940,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "10px" : "80px",
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "-100px" : "50px",
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "-50px" : "40px",
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "-60px" : "30px",
        },
      },
      {
        breakpoint: 783,
        settings: {
          slidesToShow: 2,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "-60px" : "25px",
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "100px" : "150px",
          initialSlide: 0,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "80px" : "120px",
        },
      },
      {
        breakpoint: 620,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "50px" : "100px",
        },
      },
      {
        breakpoint: 570,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "30px" : "70px",
        },
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1,
          infinite: data.length > 3,
          centerPadding: popular_flag === 5 ? "10px" : "50px",
        },
      },
      {
        breakpoint: 478,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          infinite: data.length > 3,
          centerPadding: "100px",
          centerMode: false,
        },
      },
    ],
    draggable: true,
    swipeToSlide: true,
  };
};

export { settings, settings_booking };