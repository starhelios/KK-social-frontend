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
  Avatar,
} from 'antd';
import { CameraOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ImgCrop from 'antd-img-crop';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';
import _get from 'lodash/get';
import { toast } from 'react-toastify';
import _debounce from 'lodash/debounce';
import { useHistory } from 'react-router-dom';

import './styles.scss';
import avatar_img from '../../assets/img/avatar.jpg';
import { storage } from '../../utils/firebase';
import { authServices } from '../../services/authServices';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../../redux/selectors/authSelector';
import { AUTH_SET_USER_INFO } from '../../redux/types/authTypes';
import SearchIcon from '../../assets/img/search-icon.png';
import { categoryServices } from '../../services/categoryService';
import SearchLocationInput from '../../layouts/Dashboard/SearchLocationInput';


const BecomeHost = (props) => {
  const [query, setQuery] = useState('')
  const [cityChosen, setCityChosen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [styleAvatar, setStyleAvatar] = useState({});
  const userInfoSelector = useSelector((state) => getUserInfo(state));
  const [showChangePass, setShowChangePass] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isHost, setIsHost] = useState()
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setIsHost(props.isHost)
  }, [])

  let setFirstPass = localStorage.getItem('setFirstPass');
  if (setFirstPass === 'true') {
    setFirstPass = true;
  } else {
    setFirstPass = false;
  }

  const callApiSearch = (value) => {
    categoryServices.searchCategory(value).then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const payload = _get(data, 'payload', null);

      if (!errorStatus) {
        setCategories(payload);
      }
    });
  };

  const handleSeachCategories = useCallback(_debounce(callApiSearch, 1000), []);

  const { handleSubmit, errors, reset, control, setValue, watch } = useForm({
    mode: 'onBlur',
  });

  const beforeUpload = (file) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      message.error('You can only upload image file!');
    }

    // You can remove this validation if you want
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  const customUpload = ({ onError, onSuccess, file }) => {
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    setLoading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => { },
      (error) => {
        onError(error);
      },
      () => {
        storage
          .ref('images')
          .child(`${file.name}`)
          .getDownloadURL()
          .then((url) => {
            onSuccess(null, url);
            setImageUrl(url);
            setLoading(false);
          });
      }
    );
  };

  const onSubmit = async (values) => {
    const params = {
      dateOfBirth: values.dateOfBirth.toDate(),
      fullname: values.fullname,
      email: values.email,
      aboutMe: values.aboutMe,
      isHost: true,
      location: query,
    };

    if (imageUrl) {
      params.avatarUrl = imageUrl;
    }
    setLoadingSubmit(true);

    console.log(userInfoSelector.randomString)
    authServices.updateUserInfo(userInfoSelector.randomString, params).then((res) => {
      const { data } = res;
      const errorStatus = _get(data, 'error.status', true);
      const errorMessage = _get(data, 'error.message', '');
      const payload = _get(data, 'payload', null);

      if (!showChangePass) {
        setLoadingSubmit(false);
      }

      if (!errorStatus) {
        toast.success("Success, refreshing...");
        dispatch({ type: AUTH_SET_USER_INFO, payload });
        setTimeout(() => {
          history.go(0);
        }, 2500);
      } else {
        toast.error(errorMessage);
      }
    });
  };

 useEffect(() => {
    if (imageUrl) {
      console.log('image url...',imageUrl)
      setStyleAvatar({
        background: `url(${imageUrl}) center no-repeat`,
        position: 'relative',
        height: '150px',
        width: '150px',
        minHeight: "150px",
        minWidth: "150px",
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center', alignItems: 'flex-end', borderRadius: '50%'
      });
    }
  }, [imageUrl]);

  useEffect(() => {
    callApiSearch('');
  }, []);
  useEffect(() => {
    if (userInfoSelector) {
      setLoading(false);
      setValue('fullname', userInfoSelector.fullname, { shouldDirty: true });
      setValue('email', userInfoSelector.email, { shouldDirty: true });
      setValue('dateOfBirth', userInfoSelector.dateOfBirth ? moment(userInfoSelector.dateOfBirth): null, {
        shouldDirty: true,
      });
      setValue('aboutMe', userInfoSelector.aboutMe, {shouldDirty: true})
      setValue('location', userInfoSelector.location, {shouldDirty: true})

      // warning
      if (userInfoSelector.avatarUrl) {
        setImageUrl(userInfoSelector.avatarUrl);
      }
    } else {
      setLoading(true);
    }
  }, [userInfoSelector]);
  
  return (
    <Col className="edit-profile-wrapper" sm={24} xs={24}>
      <Row className="edit-profile-header" justify="center">
        <h2>{isHost ? "Edit Host Profile": "Become A Host"}</h2>
      </Row>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="edit-profile-content">
          <Col sm={24} xs={24}>
            <Row className='edit-profile-photo' justify='center'
            align='middle' style={{ marginBottom: 33, position: 'relative', flexDirection: 'column'}}>
                <div>
                <ImgCrop>
                  <Upload
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    customRequest={customUpload}
                  >
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                    <Avatar size={150} src={imageUrl && imageUrl.length ? imageUrl : avatar_img} />
                      <CameraOutlined style={imageUrl.length ? {zIndex: 999, color: 'white', position: 'relative', bottom: 20}: {zIndex: 999, color: 'white', position: 'relative', bottom: 35}} />
                    
                    </div>
                  </Upload>
                </ImgCrop>
                </div>
            </Row>

            <Row>
              <h4>Full Name</h4>
            </Row>
            <Row>
              <Controller
                as={<Input />}
                name="fullname"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must enter your full name',
                  },
                }}
              />
              {errors.fullname && (
                <div className="errorText">{errors.fullname.message}</div>
              )}
            </Row>
            <Row className="edit-profile-line" />
            <Row>
              <h4>Email Address</h4>
            </Row>
            <Row>
              <Controller
                as={<Input />}
                name="email"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must enter your email',
                  },
                  validate: (input) => isEmail(input),
                }}
              />
              {errors.email && (
                <div className="errorText">{errors.email.message}</div>
              )}
              {errors.email && errors.email.type === 'validate' && (
                <div className="errorText">Wrong format email</div>
              )}
            </Row>
            <Row className="edit-profile-line" />
            <Row>
              <h4>Date of Birth</h4>
            </Row>
            <Row>
              <Controller
                as={<DatePicker size="middle" format="MM-DD-YYYY" />}
                name="dateOfBirth"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must choose birthday',
                  },
                }}
              />
            </Row>
            <Row className="edit-profile-line" />

            <Row>
              <h4>About Me</h4>
            </Row>
            <Row>
              <Controller
                as={<Input placeholder="Enter about me" />}
                name="aboutMe"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'You must enter your about',
                  },
                }}
              />
              {errors.aboutMe && (
                <div className="errorText">{errors.aboutMe.message}</div>
              )}
            </Row>
            <Row className="edit-profile-line" />
            <Row>
              <h4>Location</h4>
            </Row>
            <Row>
              <Controller
                as={<SearchLocationInput userInfo={userInfoSelector} query={query} setQuery={setQuery} pageClass="search-profile" cityChosen={cityChosen} setCityChosen={setCityChosen} showIcon={false} />}
                name="location"
                control={control}
                rules={{
                  required: {
                    value: !query.length,
                    message: 'You must enter your location',
                  },
                }}
              />

            </Row>
            {errors.location && (
              <div className="errorText">{errors.location.message}</div>
            )}
            <Row className="edit-profile-line" />
            {/* Need confirm and remove below code. */}
            {/* <Row style={{ cursor: 'hover' }}>
              <h4>Category</h4>
            </Row>
            <Row align="middle" justify="start" style={{ cursor: 'hover' }}>
              <Col md={24} sm={24} xs={24}>
                <Dropdown overlay={showDropDownMenu}>
                  <p style={{ fontSize: '20px', color: 'white' }}>{`${
                    selectedCategory ? selectedCategory.name : `Select Category`
                  }`}</p>
                </Dropdown>
              </Col>
            </Row> 
            <Row className="edit-profile-line" /> */}
            <Row className="save-btn" justify="center">
              <Col sm={20} xs={20}>
                <Button htmlType="submit" loading={loadingSubmit}>
                  {userInfoSelector.isHost ? "Save": "Become A Host"}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </Col>
  );
};

export default BecomeHost;
