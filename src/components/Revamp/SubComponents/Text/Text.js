import React from "react";
import styled from "styled-components";

const TextWrapper = styled.p`
  font-family: Avenir Next;
  font-size: 1rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

export default function Text({ children, ...rest }) {
  return <TextWrapper {...rest}>{children}</TextWrapper>;
}

const FooterCCWrapper = styled.p`
  opacity: 0.5;
  font-family: Avenir Next;
  font-size: 1rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin: 0;
  @media (max-width: 960px) {
    margin-bottom: 20px;
  }
`;
export function FooterCC({ children, ...rest }) {
  return <FooterCCWrapper {...rest}>{children}</FooterCCWrapper>;
}
