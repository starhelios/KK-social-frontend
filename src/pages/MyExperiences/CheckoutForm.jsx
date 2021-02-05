import React, { useState, useEffect } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Row, Col, Button, Modal, Checkbox } from 'antd';
import { Select, Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { paymentsServices } from '../../services/paymentServices';

import {  useStripe, useElements } from '@stripe/react-stripe-js';
import { experienceServices } from '../../services/experienceService';
const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#e0e0e0',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm = (props) => {
  console.log(props);
  const elements = useElements();
  const stripe = useStripe();
  const [newState, setNewState] = useState(false);
  const [name, setName] = useState('');
  const [postal, setPostal] = useState('');



  useEffect(() => {
    return props.paymentType === 'new' ? setNewState(true): setNewState(false)
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    props.setIsSubmitting(true);

    const cardElement = elements.getElement(CardNumberElement);

    const result = await paymentsServices.GenerateIntentForChargeCustomerExperience(
      {
        experienceID: `${props.modalDataToShow[`id`]}`,
        amount:
          parseInt(props.modalDataToShow[`price`]) *
          parseInt(props.guest_number) *
          100,
        payment_type: props.paymentType,
        payment_method_id:
          !newState ? `${props.paymentMethodID.id}` : null,
      }
    );
      console.log(result)

    if (result.data.error.status) {
      console.log('[error]', result.data.error);
      props.setErrorMessage(`Oops. Something went wrong. Please try again later.`);
      props.setPaymentMethod(null);

      props.setIsSubmitting(false);
    } else {
      const payload = await stripe.confirmCardPayment(result.data.payload, {
        payment_method:
          !newState
            ? `${props.paymentMethodID.id}`
            : {
                card: cardElement,
                billing_details: {
                  name: name,
                },
              },
      });
      console.log('running');
      console.log(payload);
      if (payload.error) {
        console.log('[error]', payload.error);
        props.setErrorMessage(payload.error.message);
        props.setPaymentMethod(null);

        props.setIsSubmitting(false);
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
            userID: `${props.modalDataToShow[`userId`]}`,
            experienceID: `${props.modalDataToShow[`id`]}`,
          });
          const userId = localStorage.getItem('userId');
          const sendData = await experienceServices.reserveExperience({...props.itemInfo, paymentIntent: payload.paymentIntent, guests: props.guest_number, userId: userId, experienceId: props.experienceId, imageUrl: props.imageUrl})
          props.setPaymentMethod(payload.paymentMethod);
          console.log('experience id...',props.experienceId)
          props.setErrorMessage(null);

          props.setIsSubmitting(false);

          props.handleConfirmAndPay('success');
        }

        props.setIsSubmitting(false);
        props.setShowNewCardForm(false)
        props.handleConfirmAndPay('other');
      }
    }
  };

  return (
    <div>
      <Row style={{display: 'flex', alignItems: 'center'}}>
        <LeftOutlined onClick={() => props.setShowNewCardForm(false)} style={{fontSize: '20px'}} />
        <h1 style={{marginBottom: '0', marginLeft: '15px'}}>Add New Payment</h1>
      </Row>
      <form onSubmit={handleSubmit}>
        {newState ? (
          <>
            <label htmlFor="name">Full Name</label>
            <Input
              id="name"
              required
              placeholder="Jenny Rosen"
              className="stripe-regular-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Row className="stripe-format-row" />
            <label htmlFor="cardNumber">Card Number</label>
            <CardNumberElement id="cardNumber" options={ELEMENT_OPTIONS} />
            <Row className="stripe-format-row" />
            <label htmlFor="expiry">Card Expiration</label>
            <CardExpiryElement id="expiry" options={ELEMENT_OPTIONS} />
            <Row className="stripe-format-row" />
            <label htmlFor="cvc">CVC</label>
            <CardCvcElement id="cvc" options={ELEMENT_OPTIONS} />
            <Row className="stripe-format-row" />
            <label htmlFor="postal">Postal Code</label>
            <Input
              id="postal"
              required
              placeholder="12345"
              value={postal}
              className="stripe-regular-input"
              onChange={(e) => {
                setPostal(e.target.value);
              }}
            />
            

          </>
        ) : (
          <></>
        )}
        {props.errorMessage && <div style={{ color: 'red' }}>{props.errorMessage}</div>}
        {props.paymentMethod && <div>Got PaymentMethod: {props.paymentMethod.id}</div>}
        <Row className="confirm-pay-modal-right-side-text" justify="center">
          <Col>
            <h4>
              By selecting the button below, you agree to the Guest Release and
              Waiver, and the Guest Refund Policy
            </h4>
          </Col>
        </Row>
        <Row justify="center" className="loginbtn">
          <Button htmlType="submit" disabled={!stripe} loading={props.isSubmitting}  style={{backgroundColor: "#E42435", borderRadius: '30.625px', color: 'white', fontWeight: '600', fontSize: '17.5px', lineHeight: '17.5px', textAlign: 'center', height: '50px', width: `${6.3409090909 * 50}px`}}>Confirm & Pay</Button>
        </Row>
        {/* <button type="submit" disabled={!stripe}>
          Pay
        </button> */}
      </form>
    </div>
  );
};

export default CheckoutForm;
