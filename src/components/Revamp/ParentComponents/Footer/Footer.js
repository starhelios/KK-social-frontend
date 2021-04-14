import React from "react";
import styled from "styled-components";

import Headers from "../../SubComponents/Headers/Headers";
import Links from "../../SubComponents/Links/Links";
import Text, { FooterCC } from "../../SubComponents/Text/Text";

import { GooglePlayButton } from "../../../../assets/svg/google-play-button";
import { AppleStoreButton } from "../../../../assets/svg/app-store-button";
import InstagramImage from "../../../../assets/png/instagram@2x.png";
import FacebookImage from "../../../../assets/png/facebook@2x.png";
import TwitterImage from "../../../../assets/png/twitter@2x.png";
import SnapchatImage from "../../../../assets/png/snapchat@2x.png";

const FooterWrapper = styled.footer`
  background: #2a2a29;
  padding: 84px 84px 42px 84px;
  @media (max-width: 645px) {
    padding: 30px 30px 15px 30px;
  }
`;
const TopLinksWrapper = styled.div`
  display: grid;
  grid-template-columns: [first] 0.5029fr [second] 0.2912fr [third] 0.1575fr;
  grid-template-areas: "first second third";
  margin-bottom: 90px;
  justify-content: space-between;
  @media (max-width: 1024px) {
    grid-template-areas: "first first second";
  }
  @media (max-width: 645px) {
    grid-template-areas:
      "first first first"
      "second third third";
  }
`;
const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const AboutLinksWrapper = styled.div`
  grid-area: first;
  @media (max-width: 1024px) {
    margin-bottom: 50px;
  }
`;
const HelpLinksWrapper = styled.div`
  grid-area: second;
`;

const LinksWrapper = styled.div`
  display: flex;
  & div:first-child {
    margin-right: 80px;
  }
`;
const InnerLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const DownloadLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const SocialImageWrapper = styled.div`
  width: 44px;
  margin: 0px 11.5px;
`;
const SocialLinksWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const TextWrapper = styled(Text)`
  margin: 0;
`;

const DownloadButtonWrapper = styled.div`
  margin-bottom: 16px;
`;
export default function Footer() {
  return (
    <FooterWrapper>
      <TopLinksWrapper>
        <AboutLinksWrapper>
          <Headers>About</Headers>
          <LinksWrapper>
            <InnerLinksWrapper>
              <Links>Our Mission</Links>
              <Links to="/terms-of-service">Terms of Service</Links>
              <Links to="/privacy-policy">Privacy Policy</Links>
            </InnerLinksWrapper>
            <InnerLinksWrapper>
              <Links to="/cookie-policy">Cookie Policy</Links>
              <Links to="/ccpa">CCPA Notice</Links>
            </InnerLinksWrapper>
          </LinksWrapper>
        </AboutLinksWrapper>
        <HelpLinksWrapper>
          <Headers>Help</Headers>
          <InnerLinksWrapper>
            <Links to="/faq">FAQs</Links>
            <Links to="/faq">Contact Us</Links>
          </InnerLinksWrapper>
        </HelpLinksWrapper>
        <DownloadLinksWrapper>
          <Headers>Download</Headers>
          <DownloadButtonWrapper>
            <GooglePlayButton />
          </DownloadButtonWrapper>
          <AppleStoreButton />
        </DownloadLinksWrapper>
      </TopLinksWrapper>
      <BottomWrapper>
        <FooterCC>© 2021 Klout Kast, Inc. · All Rights Reserved</FooterCC>
        <SocialLinksWrapper>
          <TextWrapper>Follow us on:</TextWrapper>
          <SocialImageWrapper>
            <a href="https://www.instagram.com/kloutkast/" target="_blank">
              <img
                style={{ height: "100%", width: "100%" }}
                src={InstagramImage}
              />
            </a>
          </SocialImageWrapper>
          <SocialImageWrapper>
            <a href="https://www.facebook.com/kloutkast/" target="_blank">
              <img
                style={{ height: "100%", width: "100%" }}
                src={FacebookImage}
              />
            </a>
          </SocialImageWrapper>
          <SocialImageWrapper>
            <a href="https://twitter.com/kloutkast" target="_blank">
              <img
                style={{ height: "100%", width: "100%" }}
                src={TwitterImage}
              />
            </a>
          </SocialImageWrapper>
          <SocialImageWrapper style={{ marginRight: "0" }}>
            <img
              style={{ height: "100%", width: "100%" }}
              src={SnapchatImage}
            />
          </SocialImageWrapper>
        </SocialLinksWrapper>
      </BottomWrapper>
    </FooterWrapper>
  );
}
