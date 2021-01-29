import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Checkbox } from 'antd';
import { Select, Input, Radio } from 'antd';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import RedStarIcon from '../../assets/img/experience/red-star.png';
import exp_image1 from '../../assets/img/experience/Picture1.png';
import CheckoutForm from './CheckoutForm';
import './MyExperiences.scss';
const STRIPE_PK_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const { Option } = Select;

const stripePromise = loadStripe(STRIPE_PK_KEY);

const ConfirmPayModal = ({
  showConfirmAndPayModal,
  guest_number,
  handleConfirmAndPayModal,
  handleConfirmAndPay,
  modalDataToShow,
  itemInfo,
  userData, imageUrl
}) => {
  const currencyFormat = (num) => {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
  const [loadingModal, setLoadingModal] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardVal, setSelectedCardVal] = useState(null);
  const [isNewCard, setIsNewCard] = useState('saved');
  useEffect(() => {
    if (Object.entries(modalDataToShow).length !== 0) {
      setLoadingModal(false);
    }
  }, [modalDataToShow]);
  console.log(itemInfo)

  useEffect(() => {
    if (userData && userData.availableMethods.length > 0) {
      let elem = userData.availableMethods[0];
      setSelectedCard(
        `${elem.cardBrand.toUpperCase()} ending with ${elem.last4digits}`
      );
      setSelectedCardVal(elem);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.availableMethods.length === 0) {
      setIsNewCard('new');
    }
  }, [userData]);
  if (loadingModal) {
    return <>Loading</>;
  }
  console.log(itemInfo);
  return (
    <Modal
      width={1000}
      centered
      visible={showConfirmAndPayModal}
      className="confirm-pay-modal"
      onCancel={() => handleConfirmAndPayModal(false)}
    >
      <Row>
        <Col className="confirm-pay-modal-left-side" xs={24} md={12}>
          <Row align="middle">
            <Col md={24} xs={24}>
              <h1 className="confirm-pay-modal-title">Confirm & Pay</h1>
            </Col>
          </Row>
          <Row align="middle">
            <Col md={11} sm={11} xs={11}>
              <img src={`${modalDataToShow.images[0]}`} alt="" />
            </Col>
            <Col md={12} sm={12} xs={12} offset={1}>
              <Row>
                <h1>{modalDataToShow[`title`]}</h1>
              </Row>
              <Row align="middle">
                <Col className="red-review-icon">
                  <img src={RedStarIcon} alt="" />
                </Col>
                <Col offset={1}>
                  <h5>4.4</h5>
                </Col>
                <Col offset={1}>
                  <h5 style={{ opacity: '0.5' }}>(314)</h5>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="confirm-pay-modal-left-side-item">
            <Col md={24} sm={24} xs={24}>
              <Row className="confirm-pay-modal-left-side-item-title">
                <h2>Date</h2>
              </Row>
              <Row className="confirm-pay-modal-left-side-item-content">
                <h3>
                  {itemInfo
                    ? `${itemInfo[`day`]} ${itemInfo[`startTime`]} - ${
                        itemInfo[`endTime`]
                      }`
                    : ``}
                </h3>
              </Row>
            </Col>
          </Row>
          <Row className="confirm-pay-modal-left-side-item">
            <Col md={24} sm={24} xs={24}>
              <Row className="confirm-pay-modal-left-side-item-title">
                <h2>Guests</h2>
              </Row>
              <Row className="confirm-pay-modal-left-side-item-content">
                <span>{guest_number}</span>
                <span style={{ marginLeft: '6px' }}>person</span>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col className="confirm-pay-modal-right-side" xs={24} md={12}>
          <Row className="confirm-pay-modal-right-side-item">
            <Col md={24} sm={24} xs={24}>
              <Row className="confirm-pay-modal-right-side-item-title">
                <h2>Price Details</h2>
              </Row>
              <Row className="confirm-pay-modal-right-side-item-content">
                <Col md={12} sm={12} xs={12}>
                  <Row>
                    <Col>
                      <h3>{currencyFormat(modalDataToShow[`price`])}</h3>
                    </Col>
                    <Col offset={1}>
                      <h3>x</h3>
                    </Col>
                    <Col offset={1}>
                      <h3>{guest_number}</h3>
                    </Col>
                    <Col offset={1}>
                      <h3>person</h3>
                    </Col>
                  </Row>
                </Col>
                <Col md={12} sm={12} xs={12}>
                  <Row justify="end">
                    <h3 style={{ fontWeight: '700' }}>
                      {currencyFormat(modalDataToShow[`price`] * guest_number)}
                    </h3>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="confirm-pay-modal-right-side-item">
            <Col md={24} sm={24} xs={24}>
              <Row>
                <h3>Payment</h3>
              </Row>
              <Row className="confirm-pay-modal-right-side-item-title">
                {' '}
                <Radio.Group
                  onChange={(e) => {
                    setIsNewCard(e.target.value);
                  }}
                  value={isNewCard}
                >
                  <Radio
                    value={'saved'}
                    disabled={
                      !(userData && userData.availableMethods.length > 0)
                    }
                  >
                    {userData && userData.availableMethods.length > 0
                      ? `Saved payment methods`
                      : `No saved payment methods`}
                  </Radio>
                  <Radio value={'new'}>Use new card</Radio>
                </Radio.Group>
              </Row>

              <Row style={{ marginTop: '20px' }} />
              <Row className="confirm-pay-modal-right-side-item-content">
                {isNewCard === 'new' ? (
                  <></>
                ) : (
                  <Select
                    value={selectedCard}
                    onChange={(val) => {
                      setSelectedCard(val);
                      setSelectedCardVal(
                        userData.availableMethods.find(
                          (element) => element.id === val
                        )
                      );
                    }}
                  >
                    {userData &&
                      userData.availableMethods.length > 0 &&
                      userData.availableMethods.map((elem, index) => {
                        return (
                          <Option key={elem.id}>
                            {`${elem.cardBrand.toUpperCase()} ending with ${
                              elem.last4digits
                            }`}
                          </Option>
                        );
                      })}
                  </Select>
                )}
              </Row>
              <Row className="confirm-pay-modal-right-side-item-content">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    handleConfirmAndPay={handleConfirmAndPay}
                    modalDataToShow={modalDataToShow}
                    itemInfo={itemInfo}
                    paymentType={isNewCard}
                    paymentMethodID={selectedCardVal}
                    guest_number={guest_number}
                    imageUrl={imageUrl}
                  />
                </Elements>
              </Row>
            </Col>
          </Row>
          {/* <Row className="confirm-pay-modal-right-side-text" justify="center">
            <Col>
              <h4>
                By selecting the button below, you agree to ther Guest Release
                and Waiver, and the Guest Refund Policy
              </h4>
            </Col>
          </Row>
          <Row justify="center" className="loginbtn">
            <Button
              onClick={async (event) => {
                handleConfirmAndPay();
              }}
            >
              Confirm & Pay
            </Button>
          </Row> */}
        </Col>
      </Row>
    </Modal>
  );
};

export default ConfirmPayModal;
