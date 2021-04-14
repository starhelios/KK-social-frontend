import React from "react";
import styled from "styled-components";

const ButtonWrapper = styled.button`
  font-family: AvenirNext;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  border-radius: 20.5px;
  background-color: #e41e35;
  padding: 12px 23px;
  border: none;
`;

export default function Buttons({ children, ...rest }) {
  return <ButtonWrapper {...rest}>{children}</ButtonWrapper>;
}
