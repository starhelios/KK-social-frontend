import React, { useState } from 'react';
import { Button, Col, Row } from 'antd';
import _debounce from "lodash/debounce";
import { toast } from "react-toastify";

function ZoomIntegration({ userInfoSelector }) {
  const [loading, setLoading] = useState(false);
  return (
    <Col className="edit-profile-wrapper" sm={24} xs={24}>
      <Row className="edit-profile-header" justify="center">
        <h2>Zoom Authorization</h2>
      </Row>

      <Row className="edit-profile-line" />

      <Row className="edit-profile-content">
        <Col sm={24} xs={24}>
          <Row className="del-btn" justify="center">
            <Col sm={20} xs={20}>
              <Button
                style={{
                  fontFamily: 'Avenir Next',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'inline-block',
                  textAlign: 'center',
                  color: '#383838',
                  borderRadius: '50px',
                  borderColor: 'white',
                  background: 'white',
                }}
                onClick={async () => {
                  setLoading(true);
                  try {
                    toast.success('Re-directing to Zoom');
                    const redirect_user = _debounce(() => {
                      window.location.href = `https://zoom.us/oauth/authorize?client_id=neNtJG1EQAG2YieBwjwTg&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fprofile`;
                    }, 1500);
                    redirect_user();
                  } catch (err) {
                    console.log(err);
                    toast.err('Something went wrong.');
                  }
                  setLoading(false);
                }}
                disabled={userInfoSelector.id.length ? false : true}
                loading={loading}
              >
                Connect Your Zoom Account
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}
export default ZoomIntegration;