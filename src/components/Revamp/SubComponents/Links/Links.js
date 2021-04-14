import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LinkWrapper = styled(Link)`
  font-family: AvenirNext;
  font-size: 1.22rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 16px;
`;
export default function Links({ children, ...rest }) {
  return <LinkWrapper {...rest}>{children}</LinkWrapper>;
}
