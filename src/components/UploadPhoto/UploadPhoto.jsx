import './UploadPhoto';
import React, { useState, useEffect } from 'react';
import { Upload, message, Row } from 'antd';
import ImgCrop from 'antd-img-crop';
import _get from 'lodash/get';

import UploadIcon from '../../assets/img/experience/upload_photo.png';
import { storage } from '../../utils/firebase';
import { experienceServices } from '../../services/experienceService';
import axios from 'axios';

export const UploadPhoto = ({ images, setImages, propImages }) => {
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    if(propImages && propImages.length && !fileList.length){
      const props = propImages.map((item, idx) => {
        const newObject = Object.create({})
        newObject.url = item;
        newObject.uid = idx
        return newObject;
      })
      setImages(propImages)
      setFileList(props)
    }
  }, [])

  console.log(fileList)

  const uploadButton = (
    <div style={{ marginTop: '-5px' }}>
      <Row justify='center'>
        <img src={UploadIcon} style={{ margin: 'none' }} />
      </Row>
    </div>
  );

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

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
    //TODO make axios call to backend
    console.log('file...',file)
    let fileData = new FormData();
    fileData.append('image', file)
    experienceServices.uploadPhoto(fileData)
    .then((res) => {
          const { data } = res;
          const errorStatus = _get(data, 'error.status', true);
          const payload = _get(data, 'payload', null);

          if (!errorStatus) {
            onSuccess(null, payload.uploadedPhoto);
            setImages([...images, payload.uploadedPhoto]);
          } else{
            onError(errorStatus)
          }
        });
    
  };

  return (
    <div className='upload-photo-wrapper'>
      <ImgCrop rotate>
        <Upload
          listType='picture-card'
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={beforeUpload}
          customRequest={customUpload}
        >

          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </ImgCrop>
    </div>
  );
};
export default UploadPhoto;
