import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterSection>
            <SectionTitle>Customer Care</SectionTitle>
            <FooterLinks>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/how-to-buy">How to Buy</Link></li>
              <li><Link to="/returns-refunds">Returns & Refunds</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Daraz Deals</SectionTitle>
            <FooterLinks>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/affiliate-program">Affiliate Program</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Payment</SectionTitle>
            <PaymentMethods>
              <PaymentMethod>Visa</PaymentMethod>
              <PaymentMethod>Mastercard</PaymentMethod>
              <PaymentMethod>PayPal</PaymentMethod>
              <PaymentMethod>Credit Card</PaymentMethod>
            </PaymentMethods>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Follow Us</SectionTitle>
            <SocialIcons>
              <SocialIcon href="https://facebook.com" target="_blank">
                <FaFacebook />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="https://instagram.com" target="_blank">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" target="_blank">
                <FaYoutube />
              </SocialIcon>
            </SocialIcons>
          </FooterSection>
        </FooterContent>
      </Container>
      <Copyright>
        <Container>
          <p>&copy; {new Date().getFullYear()} Daraz Deals. All Rights Reserved.</p>
        </Container>
      </Copyright>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 40px 0 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 700;
`;

const FooterLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  li a {
    color: #cccccc;
    font-size: 14px;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PaymentMethod = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  color: ${props => props.theme.colors.secondary};
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 20px;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Copyright = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 20px;
  padding: 20px 0;
  text-align: center;
  background-color: ${props => props.theme.colors.primaryDark};
  
  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

export default Footer; 