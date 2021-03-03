import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import _get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";

import { getUserInfo } from "../../redux/selectors/authSelector";
import PopularExperienceByMe from "../../components/SwiperComponent/PopularExperienceByMe";
import "./styles.scss";
import { experienceServices } from "../../services/experienceService";
import { convertExperience } from "../../utils/utils";

const ExperiencesHostedByMe = () => {
  const [experienceData, setExperienceData] = useState([]);
  const userInfoSelector = useSelector((state) => getUserInfo(state));

  useEffect(() => {
    if (userInfoSelector && userInfoSelector.experiences.length) {
      setExperienceData(userInfoSelector.experiences);
    }
  }, [userInfoSelector]);

  return (
    <div className="dashboard-wrapper">
      <Row>
        <Col md={24} xs={24} sm={24}>
          <Row
            className="experiences-wrapper"
            style={{ minWidth: "100vw", padding: "0px 5%" }}
            justify="center"
          >
            <Col>
              <PopularExperienceByMe data={experienceData} />
            </Col>
          </Row>

          {/* <Row className='hosts-wrapper' style={{ marginBottom: 226 }}> */}
        </Col>
      </Row>
    </div>
  );
};

export default ExperiencesHostedByMe;
