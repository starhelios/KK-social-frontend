import React, { useState } from "react";
import Swiper from "react-id-swiper";
import { Link, useHistory } from "react-router-dom";
import { Card, Col, Dropdown, Image, Row } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./PopularExperience.scss";

const { Meta } = Card;

const PopularExperienceByMe = ({ data, theme }) => {
  const [activeItem, setActiveItem] = useState();
  let history = useHistory();
  const title = `${
    data.length > 0 ? `(${data.length}) ` : ""
  }Popular Experiences`;

  const params = {
    slidesPerView: "auto",
    spaceBetween: 30,
    observer: true,
    observeParents: true,
  };

  const colorDark = theme === "dark" ? { color: "black" } : {};
  console.log(data);
  return (
    <div className="popularExperience" style={{ overflowX: "visible" }}>
      <h2 className="title" style={colorDark}>
        Hosted Experience(s)
      </h2>
      <Swiper {...params} style={{ overflowX: "visible" }}>
        <Link to="/hostexperience">
          <div
            style={{
              background: "#C4C4C4",
              width: 234,
              borderRadius: 8,
              height: 345,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#2A2A29",
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
                className="card-item"
                hoverable
                style={{ width: 232, borderRadius: "18px" }}
                cover={
                  <LazyLoadImage
                    src={item.images[0]}
                    height={309}
                    width={231}
                    placeholderSrc="image"
                    effect="blur"
                    style={{ borderRadius: 12 }}
                  />
                }
                onClick={() =>
                  history.push({
                    pathname: "/edit-experience",
                    state: { experience: item },
                  })
                }
              >
                <Meta
                  // title={item.title}
                  description={
                    <Row justify="start" align="middle">
                      <Col sm={24} xs={24}>
                        <Row style={colorDark}>{item.title}</Row>
                        <Row align="middle">
                          <Col
                            sm={24}
                            xs={24}
                            style={{
                              opacity: 0.75,
                            }}
                          >
                            <span
                              style={{
                                textTransform: "capitalize",
                                ...colorDark,
                              }}
                            >
                              {item.category}
                            </span>
                            {item.specificExperience.length
                              ? item.specificExperience[0].day +
                                ` • ${item.specificExperience[0].startTime} -`
                              : ``}
                          </Col>
                          <Col
                            sm={24}
                            xs={24}
                            style={{
                              opacity: 0.75,
                            }}
                          >
                            {item.specificExperience.length
                              ? item.specificExperience[
                                  item.specificExperience.length - 1
                                ].day +
                                ` • ${
                                  item.specificExperience[
                                    item.specificExperience.length - 1
                                  ].startTime
                                }`
                              : ``}
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
