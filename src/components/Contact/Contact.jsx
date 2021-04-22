import React from "react";
import { Collapse, Card, Col, Row, Button } from "antd";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import Text from "antd/lib/typography/Text";
import * as API from '../../services/authServices';

const PageWrapper = styled.div`
  min-height: 100vh;
`;
const InputWrapper = styled.input`
    font-family: Avenir Next;
    font-size: 20.1px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #ffffff;
    background: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    padding-bottom: 27px;
    &::placeholder {
        opacity: 0.5;
    }
    &:focus {
        outline: none;
    }
`;
const InputDivWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 27px;
`;
const TextWrapper = styled(Text)`
    opacity: 0.75;
    font-family: Avenir Next;
    font-size: 15px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #ffffff;
    margin-bottom: 20px;
`;
const ErrorMessage = styled(Text)`
    opacity: 1;
    font-family: Avenir Next;
    font-size: 15px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: red;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ButtonWrapper = styled(Button)`
    padding: 19px 145px 18px 146px;
    border-radius: 30.6px;
    background-color: #eaeaea;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Avenir Next;
    font-size: 17.5px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #2a2a29;
    @media (max-width:446px) {
        width: 100%;padding: 15px 0px;margin-bottom: 27px;
    }
`;
const ContentWrapper = styled.div`
     padding: 33px 46px;
    border-radius: 20px;
    background-color: #2a2a29;
    @media (max-width:446px) {
        padding: 12px 16px;
    }
}
`;
export default function Contact() {
    const [contactUsData, setContactUsData] = React.useState({});
    const [success, setSuccess] = React.useState(false);
    const [errors, setErrors] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
     React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactDataChange = (e) => {
    setContactUsData((prevState) => ({...prevState, [e.target.name]: e.target.value}))
  }

  const handleSendContactData = async () => {
      setLoading(true)
      const data = Object.assign(contactUsData, {id: uuidv4()})
    const response = await API.authServices.sendContactData(data)
    console.log(response.data.success);
    if(response.data.success) {
        setSuccess(true);
        setLoading(false);
    }
    else if(!response.data.success) {
        setErrors(true);
        setLoading(false);
    }
  }
    return (
        <div>
            <Row>
      <Col
        xs={24}
        md={18}
        lg={12}
        style={{ maxWidth: "779px", margin: "0 auto" }}
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Avenir Next",
            fontSize: "24px",
            fontWeight: "600",
            color: "white",
          }}
        >
          Contact Us
        </h1>
        <p style={{fontSize: "19.1px", fontWeight: "600", lineHeight: "1", fontFamily: 'Avenir Next'}}>We love hearing from our customers. Please fill out the form below or shoot us an email</p>
        <PageWrapper>
            <ContentWrapper>
                {!success && (
                    <>
                        <InputDivWrapper>
                            <TextWrapper>Full Name</TextWrapper>
                            <InputWrapper placeholder="Full Name" name="name" onChange={(e) => {
                                e.persist()
                                handleContactDataChange(e);
                            }}/>
                        </InputDivWrapper>
                        <InputDivWrapper>
                            <TextWrapper>Email Address</TextWrapper>
                            <InputWrapper placeholder="Email Address" name="email" onChange={(e) => {
                                e.persist()
                                handleContactDataChange(e);
                            }} />
                        </InputDivWrapper>
                        <InputDivWrapper>
                            <TextWrapper>How can we help you today?</TextWrapper>
                            <InputWrapper placeholder="Input Feedback Here" name="message" onChange={(e) => {
                                e.persist()
                                handleContactDataChange(e);
                            }} />
                        </InputDivWrapper>
                        <div style={{minHeight: '42px'}}>
                            {errors && (<ErrorMessage>Something went wrong, please try again later</ErrorMessage>)}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <ButtonWrapper loading={loading} disabled={loading} onClick={(e) => {
                                e.preventDefault();
                                handleSendContactData();
                            }}>Submit</ButtonWrapper>
                        </div>
                    </>
                )}
                {success && (
                    <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <TextWrapper style={{fontSize: '24px', marginBottom: 0}}>Thank you for reaching out! We will get back to you shortly.</TextWrapper>
                    </div>
                )}
                
            </ContentWrapper>
        </PageWrapper>
      </Col>
    </Row>
        </div>
    )
}
