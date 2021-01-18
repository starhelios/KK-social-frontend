import React, { useCallback } from 'react';
import {
  Row,
  Col,
  Upload,
  message,
  Button,
  Input,
  DatePicker,
  Skeleton,
  AutoComplete,
  Spin,
  Modal,
} from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { NavLink, useHistory } from 'react-router-dom';
import {
  CameraOutlined,
  SearchOutlined,
  CreditCardOutlined,
  IdcardOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';
import _get from 'lodash/get';
import { toast } from 'react-toastify';
import _debounce from 'lodash/debounce';

import './styles.scss';
import { storage } from '../../utils/firebase';
import { authServices } from '../../services/authServices';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../../redux/selectors/authSelector';
import { AUTH_SET_USER_INFO } from '../../redux/types/authTypes';
import SearchIcon from '../../assets/img/search-icon.png';
import { categoryServices } from '../../services/categoryService';
import { paymentsServices } from '../../services/paymentServices';
import {
  cardnumberAmericanExpress,
  cardnumberDiscover,
  cardnumberMasterCard,
  cardnumberVisa,
} from './cardValidator';

export default function EditAddDeletePaymentMethod(props) {
  const { handleSubmit, errors, reset, control, setValue, watch } = useForm({
    mode: 'onBlur',
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [cardExpiryDate, setCardExpiryDate] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [showError, setShowError] = useState({
    fullName: false,
    cardExpiry: false,
    cardCVV: false,
    cardNumber: false,
  });
  const history = useHistory();

  const checkValidationsAndShowError = () => {
    let tempCardNumber = cardNumber.replace(/\s/g, '');
    let currentDate = new Date();
    let getCurrentYearVal = currentDate.getFullYear() - 2000;
    let getCurrentMonthVal = currentDate.getMonth();
    let cardExpiryYear = cardExpiryDate.split(' ');
    const checkCardVal =
      cardnumberVisa(tempCardNumber) ||
      cardnumberAmericanExpress(tempCardNumber) ||
      cardnumberDiscover(tempCardNumber) ||
      cardnumberMasterCard(tempCardNumber);

    const checkExpiryDateValidation =
      parseInt(cardExpiryYear[1]) > getCurrentYearVal ||
      (parseInt(cardExpiryYear[1]) === getCurrentYearVal &&
        getCurrentMonthVal <= parseInt(cardExpiryYear[0]));
    const errorState = {
      fullName: !(fullName.length > 1),
      cardExpiry: !checkExpiryDateValidation,
      cardCVV: !(cardCVV.length >= 3),
      cardNumber: !checkCardVal,
    };
    setShowError(errorState);
    if (
      errorState.fullName ||
      errorState.cardCVV ||
      errorState.cardNumber ||
      errorState.cardExpiry
    ) {
      return true;
    } else {
      return false;
    }
  };
  const onSubmit = async (formValues) => {
    setIsFormSubmitting(true);
    const body = {
      cardNumber,
      cardExpiryDate,
      fullName,
      cardCVV,
    };
    if (!checkValidationsAndShowError()) {
      const result = await paymentsServices.savePaymentMethods(body);
      if (result.data.error.status) {
        toast.error('Failed to add payment method.');
      } else {
        toast.success('Saved payment method. Refreshing data.');
        setTimeout(() => {
          history.go(0);
        }, 2500);
      }
      setIsFormSubmitting(false);
    } else {
      setIsFormSubmitting(false);
      toast.error('Fix payment details.');
    }
  };

  const showDeleteConfirmation = () => {
    const { confirm } = Modal;
    confirm({
      title: 'Are you sure you want to delete this card?',
      icon: <ExclamationCircleOutlined />,
      content: 'When clicked the OK button, we will delete your card.',
      onOk() {
        handleDeleteButton();
      },
      onCancel() {},
    });
  };

  const handleDeleteButton = async () => {
    if (props.selectedCard) {
      setIsFormSubmitting(true);
      const result = await paymentsServices.deletePaymentMethod({
        payment_method_id: props.selectedCard.id,
      });
      if (result.data.error.status) {
        toast.error('Failed to delete payment method.');
      } else {
        toast.success('Deleted payment method. Refreshing data.');
        setTimeout(() => {
          history.go(0);
        }, 2500);
      }
      setIsFormSubmitting(false);
    } else {
      toast.error('Card data not found.');
    }
  };
  useEffect(() => {
    if (props.selectedCard) {
      setFullName(`HIDDEN`);
      setCardNumber(`**** **** **** ${props.selectedCard.last4digits}`);
      setCardExpiryDate(
        `${props.selectedCard.expiryMonth} ${props.selectedCard.expiryYear}`
      );
      setCardCVV(`***`);
    } else {
      setFullName(``);
      setCardNumber(``);
      setCardExpiryDate(``);
      setCardCVV(``);
    }
  }, [props]);
  return (
    <Col className="edit-profile-wrapper" sm={24} xs={24}>
      <Row className="edit-profile-header" justify="center">
        <h2>
          {props.isEditMode ? `Edit Payment Method` : `Add Payment Method`}{' '}
        </h2>
      </Row>

      <Row className="edit-profile-line" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="edit-profile-content">
          <Col sm={24} xs={24}>
            <Row>
              <h4>Full Name</h4>
            </Row>
            <Row>
              <Input
                value={fullName}
                onChange={(e) => {
                  const val = e.target.value;
                  setFullName(val);
                }}
              />
              {showError.fullName && (
                <div className="errorText">Name can't be empty</div>
              )}
            </Row>
            <Row className="edit-profile-line" />
            <Row>
              <h4>Card Number</h4>
            </Row>
            <Row>
              <Input
                value={cardNumber}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^\dA-Z]/g, '')
                    .replace(/(.{4})/g, '$1 ')
                    .trim();
                  setCardNumber(val);
                }}
              />
              {showError.cardNumber && (
                <div className="errorText">Invalid Card Number</div>
              )}
            </Row>
            <Row className="edit-profile-line" />
            <Row>
              <Col sm={12} xs={12}>
                <Row>
                  <h4>Expiry Date</h4>
                </Row>
                <Row>
                  <Input
                    value={cardExpiryDate}
                    onChange={(e) => {
                      let tempVal = e.target.value;
                      if (tempVal.length < 6) {
                        const val = e.target.value
                          .replace(/[^\dA-Z]/g, '')
                          .replace(/(.{2})/g, '$1 ')
                          .trim();
                        setCardExpiryDate(val);
                      }
                    }}
                  />
                  {showError.cardExpiry && (
                    <div className="errorText">Invalid Date. Format MM-YY</div>
                  )}
                </Row>
                <Row className="edit-profile-line" />
              </Col>
              <Col sm={1} xs={1}></Col>
              <Col sm={11} xs={11}>
                <Row>
                  <h4>CVV</h4>
                </Row>
                <Row>
                  <Input
                    value={cardCVV}
                    onChange={(e) => {
                      let tempVal = e.target.value;
                      if (tempVal.length < 7) {
                        const val = e.target.value
                          .replace(/[^\dA-Z]/g, '')
                          .trim();
                        setCardCVV(val);
                      }
                    }}
                  />
                  {showError.cardCVV && (
                    <div className="errorText">CVV can't be empty</div>
                  )}
                </Row>
                <Row className="edit-profile-line" />
              </Col>
            </Row>
            {props.isEditMode ? (
              <Row className="del-btn" justify="center">
                <Col sm={20} xs={20}>
                  <Button
                    onClick={() => {
                      showDeleteConfirmation();
                    }}
                    loading={isFormSubmitting}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row className="save-btn" justify="center">
                <Col sm={20} xs={20}>
                  <Button htmlType="submit" loading={isFormSubmitting}>
                    Add
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </form>
    </Col>
  );
}
