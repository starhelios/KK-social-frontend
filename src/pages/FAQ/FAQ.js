import React from "react";
import { Collapse, Card, Col, Row } from "antd";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import "./faq.scss";

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const CollapseWrapper = styled.div`
  height: 100vh;
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
              onChange={callback}
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
                header="Zoom"
                key="2"
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "Avenir Next",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <p>Having Zoom issues?</p>
                <p>
                  <a
                    href="https://support.zoom.us/hc/en-us/sections/200258579-Chats"
                    target="_blank"
                  >
                    Click here
                  </a>{" "}
                  to speak to a Zoom representative and click the chat icon in
                  the bottom right-hand corner
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
                header="Uninstall Zoom"
                key="4"
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "Avenir Next",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <p>
                  <ul>
                    <li>
                      Login into your Zoom account and navigate to the Zoom App
                      Marketplace.
                    </li>
                    <li>
                      Click Manage > Installed Apps or search for the KloutKast
                      app.
                    </li>
                    <li>Click the KK app.</li>
                    <li>Click Uninstall</li>
                  </ul>
                </p>
              </Panel>
            </Collapse>
          </div>
        </CollapseWrapper>
      </Col>
    </Row>
  );
}
