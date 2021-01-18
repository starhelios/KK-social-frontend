import React, { useState, useEffect } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Row, Col, Button, Modal, Checkbox } from 'antd';
import { Select, Input } from 'antd';
import { paymentsServices } from '../../services/paymentServices';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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
  const [name, setName] = useState('');
  const [postal, setPostal] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsSubmitting(true);

    const result = await paymentsServices.GenerateIntentForChargeCustomerExperience(
      {
        experienceID: `${props.modalDataToShow[`id`]}`,
        amount:
          parseInt(props.modalDataToShow[`price`]) *
          parseInt(props.guest_number) *
          100,
        payment_type: props.paymentType,
        payment_method_id:
          props.paymentType === 'saved' ? `${props.paymentMethodID.id}` : null,
      }
    );

    if (result.data.error.status) {
      console.log('[error]', result.data.error);
      setErrorMessage(`Oops. Something went wrong. Please try again later.`);
      setPaymentMethod(null);

      setIsSubmitting(false);
    } else {
      const cardElement = elements.getElement(CardNumberElement);

      const payload = await stripe.confirmCardPayment(result.data.payload, {
        payment_method:
          props.paymentType === 'saved'
            ? `${props.paymentMethodID.id}`
            : {
                card: cardElement,
                billing_details: {
                  name: name,
                },
              },
      });
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
            userID: `${props.modalDataToShow[`userId`]}`,
            experienceID: `${props.modalDataToShow[`id`]}`,
          });
          setPaymentMethod(payload.paymentMethod);
          setErrorMessage(null);

          setIsSubmitting(false);

          props.handleConfirmAndPay('success');
        }

        setIsSubmitting(false);
        props.handleConfirmAndPay('other');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row className="stripe-form-line" />
      <Row style={{ marginTop: '15px' }}></Row>
      {props.paymentType === 'new' ? (
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

          <Row className="stripe-form-line" />
        </>
      ) : (
        <></>
      )}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {paymentMethod && <div>Got PaymentMethod: {paymentMethod.id}</div>}
      <Row className="confirm-pay-modal-right-side-text" justify="center">
        <Col>
          <h4>
            By selecting the button below, you agree to ther Guest Release and
            Waiver, and the Guest Refund Policy
          </h4>
        </Col>
      </Row>
      <Row justify="center" className="loginbtn">
        <Button htmlType="submit" disabled={!stripe} loading={isSubmitting}>
          Confirm & Pay
        </Button>
      </Row>
      {/* <button type="submit" disabled={!stripe}>
        Pay
      </button> */}
    </form>
  );
};

export default CheckoutForm;
