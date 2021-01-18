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
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CameraOutlined, SearchOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import './styles.scss';
import { storage } from '../../utils/firebase';
import { authServices } from '../../services/authServices';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../../redux/selectors/authSelector';
import { AUTH_SET_USER_INFO } from '../../redux/types/authTypes';
import SearchIcon from '../../assets/img/search-icon.png';
import { categoryServices } from '../../services/categoryService';
import { paymentsServices } from '../../services/paymentServices';

export default function WithdrawalOption(props) {
  const { handleSubmit, errors, reset, control, setValue, watch } = useForm({
    mode: 'onBlur',
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
                onClick={async () => {
                  setLoadingStripeURL(true);
                  try {
                    const result = await paymentsServices.generateAccountLink();

                    toast.success('Re-directing to payment setup.');
                    const redirect_user = _debounce(() => {
                      window.location.href = `${result.data.payload}`;
                    }, 1500);
                    redirect_user();
                  } catch (err) {
                    console.log(err);
                    toast.err('Something went wrong.');
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
