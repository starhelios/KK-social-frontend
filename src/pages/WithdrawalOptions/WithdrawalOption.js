import React from "react";
import { Row, Col, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import _get from "lodash/get";
import _debounce from "lodash/debounce";
import { toast } from "react-toastify";
import "./styles.scss";
import { paymentsServices } from "../../services/paymentServices";

export default function WithdrawalOption(props) {
  const { handleSubmit, errors, reset, control, setValue, watch } = useForm({
    mode: "onBlur",
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [loadingStripeURL, setLoadingStripeURL] = useState(false);
  return (
    <Col className="edit-profile-wrapper" sm={24} xs={24}>
      <Row className="edit-profile-header" justify="center">
        <h2>Withdrawal Account Setup</h2>
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
                  setLoadingStripeURL(true);
                  try {
                    const result = await paymentsServices.generateAccountLink();

                    toast.success("Re-directing to payment setup");
                    const redirect_user = _debounce(() => {
                      window.location.href = `${result.data.payload}`;
                    }, 1500);
                    redirect_user();
                  } catch (err) {
                    console.log(err);
                    toast.err("Something went wrong.");
                  }
                  setLoadingStripeURL(false);
                }}
                loading={loadingStripeURL}
              >
                Finish Account Setup For Withdrawal
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
}
