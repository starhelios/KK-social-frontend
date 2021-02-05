import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Checkbox } from 'antd';
import { Select, Input, Radio } from 'antd';


import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { paymentsServices } from '../../services/paymentServices';
import { experienceServices } from '../../services/experienceService';
import CheckoutForm from './CheckoutForm';
import './MyExperiences.scss';
const STRIPE_PK_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const { Option } = Select;

const stripePromise = loadStripe(STRIPE_PK_KEY);

const ConfirmPayModal = ({
  titleCase,
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
  const stripe = useStripe();
  const [loadingModal, setLoadingModal] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [selectedCardVal, setSelectedCardVal] = useState(null);
  const [isNewCard, setIsNewCard] = useState('saved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);


  const submitSavedCard = async() => {
    console.log('running payment')
    setIsSubmitting(true)
    const result = await paymentsServices.GenerateIntentForChargeCustomerExperience(
      {
        experienceID: `${modalDataToShow[`id`]}`,
        amount:
          parseInt(modalDataToShow[`price`]) *
          parseInt(guest_number) *
          100,
        payment_type: 'saved',
        payment_method_id:
          `${selectedCardVal.id}`
      }
    );
      console.log(result)

    if (result.data.error.status) {
      console.log('[error]', result.data.error);
      setErrorMessage(`Oops. Something went wrong. Please try again later.`);
      setPaymentMethod(null);

      setIsSubmitting(false);
    } else {
      console.log('running')
      console.log(selectedCardVal)
      const payload = await stripe.confirmCardPayment(result.data.payload, {
        payment_method:
          selectedCardVal.id
      });
      console.log('running');
      console.log(payload);
      if (payload.error) {
        console.log('[error]', payload.error);
        setErrorMessage(payload.error.message);
        setPaymentMethod(null);

        setIsSubmitting(false);
        // props.handleConfirmAndPay('error');
      } else {
        if (payload.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.

          const saveTransaction = await paymentsServices.SaveTransactionInDB({
            client_secret: `${payload.paymentIntent.client_secret}`,
            id: `${payload.paymentIntent.id}`,
            userID: `${modalDataToShow[`userId`]}`,
            experienceID: `${modalDataToShow[`id`]}`,
          });
          const userId = localStorage.getItem('userId');
          const sendData = await experienceServices.reserveExperience({...itemInfo, paymentIntent: payload.paymentIntent, guests: guest_number, userId: userId, experienceId: `${modalDataToShow[`id`]}`, imageUrl: imageUrl})
          setPaymentMethod(payload.paymentMethod);
          console.log('experience id...',`${modalDataToShow[`id`]}`)
          setErrorMessage(null);

          setIsSubmitting(false);

          handleConfirmAndPay('success');
        }

        setIsSubmitting(false);
        handleConfirmAndPay('other');
      }
    }
  }
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
      console.log('running')
      setSelectedCardVal(elem);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.availableMethods.length === 0) {
      console.log('is new')
      setIsNewCard('new');
    }
  }, [userData]);
  if (loadingModal) {
    return <>Loading</>;
  }
  console.log(itemInfo);
  return (
    <Modal
      visible={showConfirmAndPayModal}
      className="confirm-pay-modal"
      width={1000}
      footer={null}
      onCancel={() => handleConfirmAndPayModal(false)}
    >
      <div style={{padding: '50px', fontFamily: 'Avenir Next', minHeight: '50vh'}}>
        {!showNewCardForm ? (
          <div>
<h1 className="confirm-pay-modal-title">Confirm & Pay</h1>
          <Row id="modal-wrapper-details" style={{minHeight: '50vh'}}>
            <Col id="left-side-content-wrapper" flex="1 0 45%" style={{padding: '20px 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginRight: '5%'}}>
              <Row>
                <img style={{width: '171.36px', marginRight: '20px', borderRadius: '13.7085px'}} src={`${modalDataToShow.images[0]}`} alt="" />
                <h1>{titleCase(modalDataToShow[`title`])}</h1>
              </Row>
              <Row style={{marginTop: "40px"}} className="confirm-pay-modal-left-side-item-title">
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
              <Row style={{background: '#eaeaea', height: '1.95px', opacity: '1', width: '100%'}} className="profile-line" />
              </Row>
              <Row style={{marginTop: "40px"}} className="confirm-pay-modal-left-side-item-title">
                <h2>Guests</h2>
              </Row>
              <Row className="confirm-pay-modal-left-side-item-content">
                <h3>{guest_number} person</h3>
              <Row style={{background: '#eaeaea', height: '1.95px', opacity: '1', width: '100%'}} className="profile-line" />
              </Row>
            </Col>
            <Col id="right-side-content-wrapper" flex="1 0 45%" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: '5%'}}>
              <div style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: "column"}}>
                <Row className="confirm-pay-modal-right-side-item-title">
                  <h2>Price Details</h2>
                </Row>
                <Row style={{display: 'flex', justifyContent: 'space-between'}}>
                  <h3>{currencyFormat(modalDataToShow[`price`])} x {guest_number} person</h3>
                  <h3 style={{ fontWeight: '700' }}>
                        {currencyFormat(modalDataToShow[`price`] * guest_number)}
                      </h3>
                <Row style={{background: '#eaeaea', height: '1.95px', opacity: '1', width: '100%'}} className="profile-line" />
                </Row>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
                <Row style={{marginTop: "40px"}}>
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
                      onClick={() => setIsNewCard('saved')}
                      disabled={
                        !(userData && userData.availableMethods.length > 0)
                      }
                    >
                      {userData && userData.availableMethods.length > 0
                        ? `Saved payment methods`
                        : `No saved payment methods`}
                    </Radio>
                    <Radio value={'new'} onClick={() => setIsNewCard('new')}>Use new card</Radio>
                  </Radio.Group>
                </Row>
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
                <Row style={{background: '#eaeaea', height: '1.95px', opacity: '1', width: '100%'}} className="profile-line" />
                </Row>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <Row style={{marginTop: "40px"}}>
                  <p>By selecting the button below, you agree to the Guest Release and Waiver, and the Guest Refund Policy.</p>
                </Row>
                {isNewCard === "new" ? (<Button onClick={() => setShowNewCardForm(true)} style={{backgroundColor: "#E42435", borderRadius: '30.625px', color: 'white', fontWeight: '600', fontSize: '17.5px', lineHeight: '17.5px', textAlign: 'center', height: '50px', width: `${6.3409090909 * 50}px`}}>Add New Payment</Button>): <Button  loading={isSubmitting} onClick={submitSavedCard}  style={{backgroundColor: "#E42435", borderRadius: '30.625px', color: 'white', fontWeight: '600', fontSize: '17.5px', lineHeight: '17.5px', textAlign: 'center', height: '50px', width: `${6.3409090909 * 50}px`}}>Confirm & Pay</Button>}
              </div>
              </Col>
          </Row>
          </div>
        ): null}
        
              {showNewCardForm ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setIsSubmitting={setIsSubmitting}
                  isSubmitting={isSubmitting}
                  setShowNewCardForm={setShowNewCardForm}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                    handleConfirmAndPay={handleConfirmAndPay}
                    modalDataToShow={modalDataToShow}
                    itemInfo={itemInfo}
                    paymentType={isNewCard}
                    paymentMethodID={selectedCardVal}
                    guest_number={guest_number}
                    imageUrl={imageUrl}
                  />
                </Elements>
              ): null}
                
            
      </div>
      {/* <Row>
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
          
        </Col>
      </Row> */}
    </Modal>
  );
};

export default ConfirmPayModal;
