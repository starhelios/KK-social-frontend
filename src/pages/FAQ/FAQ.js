import React from "react";
import { Collapse, Card, Col, Row } from "antd";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import "./faq.scss";
import { Link } from "react-router-dom";

const { Panel } = Collapse;

const CollapseWrapper = styled.div`
  min-height: 100vh;
`;
export default function FAQ() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Row>
      <Col
        xs={24}
        md={18}
        lg={12}
        style={{ maxWidth: "779px", margin: "0 auto" }}
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Avenir Next",
            fontSize: "24px",
            fontWeight: "600",
            color: "white",
          }}
        >
          Forums
        </h1>
        <CollapseWrapper>
          <div
            style={{
              background: "#2a2a29",
              borderRadius: "10px",
              padding: "30px",
            }}
          >
            <Collapse
              defaultActiveKey={["1"]}
              style={{ background: "transparent", border: "none" }}
            >
              <Panel
                header="Support Guidelines"
                key="1"
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "Avenir Next",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <p>
                  We understand how important Klout Kast products are for
                  keeping your Experiences, whether in person or online, working
                  seamlessly and efficiently. In light of the recent COVID - 19
                  pandemic, Klout Kast remains committed to providing the best
                  possible customer experience.
                </p>
                <p>
                  To help maximize your experience, the Klout Kast Support Team
                  has outlined the following guidelines to ensure your questions
                  are answered in a consistent, timely manner.
                </p>
              </Panel>
              <Panel
                header="Contact Us"
                key="3"
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "Avenir Next",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <p>Contact us on our <Link to="/contact">Contact Page</Link> or use the links below</p>
                <p>
                  Being we are a new startup company, the best way for us to
                  manage your requests are through email:
                </p>
                <p>Click here to create a support case:</p>
                <a
                  href={`mailto:Support@kloutkast.com?&subject=Support%20Case&body=Case%20#:%20${uuidv4()}`}
                  target="_top"
                >
                  Support@kloutkast.com
                </a>
                <p>Alternatively, you can write or phone us at:</p>
                <p>
                  Klout Kast, LLC <br />
                  PO Box 30460 PMB 49964 <br />
                  New Orleans, LA. 70190
                  <a href="tel:504-356-5550">504-356-5550</a>
                </p>
                <p>Support Hours: 8am - 5pm</p>
                <p>
                  Estimated response time is 24 hours during the weekday. Any
                  requests made on the weekend will be responded to the
                  following Monday.
                </p>
              </Panel>
              <Panel
                header="Documentation"
                key="4"
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "Avenir Next",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <div>
                  <>
                    <p>
                      <h1>Zoom Installation</h1>
                      <p>
                        *Zoom is only required for Hosts to be connected and
                        create experiences for users*
                        <ul>
                          <li>Login/Signup</li>
                          <li>
                            Click Become a Host, and fill out required
                            information then select "Become a Host".
                          </li>
                          <li>
                            Click on Zoom, then click "Connect Your Zoom
                            Account"
                          </li>
                          <li>
                            You will be redirected to Zoom account where you
                            will need to Authorize the application in order to
                            start hosting experiences
                          </li>
                        </ul>
                      </p>
                    </p>
                    <p>
                      <h1>Zoom Uninstallation</h1>
                      <ul>
                        <li>
                          Login into your Zoom account and navigate to the Zoom
                          App Marketplace.
                        </li>
                        <li>
                          Click Manage > Installed Apps or search for the
                          KloutKast app.
                        </li>
                        <li>Click the KK app.</li>
                        <li>Click Uninstall</li>
                      </ul>
                    </p>

                    <p>
                      <h1>Zoom Usage</h1>
                      <p>
                        Zoom is only to be used to create meetings and join
                        meetings throughout KloutKast.
                      </p>
                      <p>Different use cases for this are..</p>
                      <ul>
                        <li>
                          Creating Experiences: Pre-requisites - Must be a Host
                        </li>
                        <li>Joining Experiences: Pre-requisites - None</li>
                      </ul>
                    </p>
                  </>
                </div>
              </Panel>
            </Collapse>
          </div>
        </CollapseWrapper>
      </Col>
    </Row>
  );
}
