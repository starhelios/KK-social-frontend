import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  opacity: 0.75;
  font-family: AvenirNext;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 20px;
`;
export default function Headers({ children, ...rest }) {
  return <HeaderWrapper {...rest}>{children}</HeaderWrapper>;
}
