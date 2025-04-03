import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaBox, FaTruck, FaUndo, FaCreditCard, FaHeadset, FaAngleRight } from 'react-icons/fa';

const HelpCenter: React.FC = () => {
  return (
    <Container>
      <Banner>
        <BannerContainer>
          <BannerTitle>How can we help you?</BannerTitle>
          <SearchContainer>
            <SearchInput type="text" placeholder="Search for help..." />
            <SearchButton>Search</SearchButton>
          </SearchContainer>
        </BannerContainer>
      </Banner>

      <Content>
        <SectionTitle>Popular Categories</SectionTitle>
        <CategoriesGrid>
          <CategoryCard>
            <CategoryIcon>
              <FaBox />
            </CategoryIcon>
            <CategoryTitle>Order Issues</CategoryTitle>
            <CategoryDescription>Track, change or cancel your order</CategoryDescription>
            <CategoryLink to="/help-center/orders">
              View FAQs <FaAngleRight />
            </CategoryLink>
          </CategoryCard>

          <CategoryCard>
            <CategoryIcon>
              <FaTruck />
            </CategoryIcon>
            <CategoryTitle>Shipping & Delivery</CategoryTitle>
            <CategoryDescription>Delivery times, tracking, and areas</CategoryDescription>
            <CategoryLink to="/help-center/shipping">
              View FAQs <FaAngleRight />
            </CategoryLink>
          </CategoryCard>

          <CategoryCard>
            <CategoryIcon>
              <FaUndo />
            </CategoryIcon>
            <CategoryTitle>Returns & Refunds</CategoryTitle>
            <CategoryDescription>How to return items and get refunds</CategoryDescription>
            <CategoryLink to="/help-center/returns">
              View FAQs <FaAngleRight />
            </CategoryLink>
          </CategoryCard>

          <CategoryCard>
            <CategoryIcon>
              <FaCreditCard />
            </CategoryIcon>
            <CategoryTitle>Payments</CategoryTitle>
            <CategoryDescription>Payment methods and issues</CategoryDescription>
            <CategoryLink to="/help-center/payments">
              View FAQs <FaAngleRight />
            </CategoryLink>
          </CategoryCard>
        </CategoriesGrid>

        <FaqSection>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FaqList>
            <FaqItem>
              <FaqQuestion>How do I track my order?</FaqQuestion>
              <FaqAnswer>
                You can track your order by going to "My Orders" in your account. Click on the specific order to see its current status and tracking information.
              </FaqAnswer>
            </FaqItem>
            <FaqItem>
              <FaqQuestion>What is Daraz's return policy?</FaqQuestion>
              <FaqAnswer>
                Daraz offers a 7-day return policy for most items. The item must be in its original condition with all tags and packaging intact. Some categories like electronics may have different return policies.
              </FaqAnswer>
            </FaqItem>
            <FaqItem>
              <FaqQuestion>How do I request a refund?</FaqQuestion>
              <FaqAnswer>
                To request a refund, go to "My Orders" in your account, find the order and click "Return/Refund". Follow the instructions to complete your request. Once approved, refunds typically take 7-14 business days to process.
              </FaqAnswer>
            </FaqItem>
            <FaqItem>
              <FaqQuestion>What payment methods are accepted?</FaqQuestion>
              <FaqAnswer>
                Daraz accepts various payment methods including credit/debit cards, online banking, mobile wallet payments, and cash on delivery depending on your location.
              </FaqAnswer>
            </FaqItem>
          </FaqList>
        </FaqSection>

        <ContactSection>
          <SectionTitle>Still Need Help?</SectionTitle>
          <ContactOptions>
            <ContactCard>
              <ContactIcon>
                <FaHeadset />
              </ContactIcon>
              <ContactTitle>Contact Customer Support</ContactTitle>
              <ContactDescription>Our team is available 24/7 to help with your questions</ContactDescription>
              <Button as={Link} to="/contact-us">Contact Us</Button>
            </ContactCard>
          </ContactOptions>
        </ContactSection>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const Banner = styled.div`
  background-color: ${props => props.theme.colors.primary};
  padding: 50px 0;
`;

const BannerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  text-align: center;
`;

const BannerTitle = styled.h1`
  color: white;
  font-size: 32px;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    border-radius: 4px;
    margin-bottom: 10px;
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    border-radius: 4px;
    width: 100%;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 50px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CategoryIcon = styled.div`
  font-size: 28px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const CategoryTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const CategoryDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 15px;
`;

const CategoryLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  
  svg {
    margin-left: 5px;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const FaqSection = styled.div`
  margin-bottom: 50px;
`;

const FaqList = styled.div`
  
`;

const FaqItem = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 20px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FaqQuestion = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const FaqAnswer = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.5;
`;

const ContactSection = styled.div`
  margin-bottom: 30px;
`;

const ContactOptions = styled.div`
  display: flex;
  justify-content: center;
`;

const ContactCard = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  max-width: 500px;
`;

const ContactIcon = styled.div`
  font-size: 36px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const ContactTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const ContactDescription = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

export default HelpCenter; 