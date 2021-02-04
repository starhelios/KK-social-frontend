import React from "react";
import Swiper from "react-id-swiper";
import { NavLink, useHistory } from "react-router-dom";
import { Card, Col, Image, Row } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./PopularExperience.scss";

const { Meta } = Card;

const PopularExperience = ({
  data,
  theme,
  title,
  isDetail,
  clearFilters,
  filterApplied,
  valueSearch,
}) => {
  let history = useHistory();

  const params = {
    slidesPerView: "auto",
    spaceBetween: 30,
    observer: true,
    observeParents: true,
  };

  const colorDark = theme === "dark" ? { color: "black" } : {};
  const titleStyle = isDetail ? { fontSize: "36.56px" } : {};

  return (
    <div className="popularExperience">
      <Row>
        <h2 className="title" style={{ ...colorDark, ...titleStyle }}>
          {title}
        </h2>
        {valueSearch && valueSearch.length ? (
          <h6
            style={{
              cursor: "pointer",
              fontSize: "12px",
              color: "red",
              textDecoration: "underline",
              marginTop: "12px",
              marginLeft: "20px",
            }}
            onClick={clearFilters}
          >
            clear filters
          </h6>
        ) : null}
      </Row>

      <Swiper {...params}>
        {data.map((item, idx) => (
          <div key={item.id}>
            <h3>
              <Card
                className="card-item"
                hoverable
                style={{ width: 232, borderRadius: "18px" }}
                cover={
                  <LazyLoadImage
                    src={item.imgLink}
                    height="100%"
                    width="232"
                    placeholderSrc="image"
                    effect="blur"
                    style={{ borderRadius: 12 }}
                  />
                }
                onClick={() =>
                  history.push({
                    pathname: `/experience/${item.id}`,
                    state: { itemData: item },
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

export default PopularExperience;
