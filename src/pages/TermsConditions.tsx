import React from 'react';
import styled from 'styled-components';

const TermsConditions: React.FC = () => {
  return (
    <Container>
      <PageHeader>
        <HeaderTitle>Terms & Conditions</HeaderTitle>
        <HeaderText>Last Updated: November 1, 2023</HeaderText>
      </PageHeader>

      <Content>
        <Section>
          <SectionTitle>1. Introduction</SectionTitle>
          <Text>
            Welcome to Daraz! These Terms and Conditions govern your use of our website, mobile applications, and services (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our Platform.
          </Text>
          <Text>
            Daraz is operated by Daraz Pakistan (Private) Limited. When we use terms like "Daraz," "we," "us," or "our," we're referring to Daraz Pakistan (Private) Limited and its affiliates.
          </Text>
        </Section>

        <Section>
          <SectionTitle>2. Account Registration</SectionTitle>
          <Text>
            To access certain features of our Platform, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information and to update it as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>
          <Text>
            We reserve the right to suspend or terminate your account if we suspect any unauthorized access or use, or if you violate these Terms and Conditions.
          </Text>
        </Section>

        <Section>
          <SectionTitle>3. Products and Services</SectionTitle>
          <Text>
            3.1. <Bold>Product Information</Bold>: We strive to provide accurate product descriptions, images, and pricing. However, we do not guarantee that product descriptions or other content on the Platform are accurate, complete, reliable, current, or error-free. In case of pricing errors, we reserve the right to cancel orders placed for incorrectly priced items.
          </Text>
          <Text>
            3.2. <Bold>Availability</Bold>: Products displayed on our Platform are subject to availability. We do not guarantee that all products shown are in stock at the time of your order.
          </Text>
          <Text>
            3.3. <Bold>Third-Party Sellers</Bold>: Some products on our Platform are sold by third-party sellers. While we strive to ensure that all sellers meet our quality standards, we are not responsible for products sold by third-party sellers.
          </Text>
        </Section>

        <Section>
          <SectionTitle>4. Orders and Payments</SectionTitle>
          <Text>
            4.1. <Bold>Order Placement</Bold>: When you place an order on our Platform, you are making an offer to purchase the product(s) at the listed price. We reserve the right to accept or reject your order for any reason, including limitations on quantities available for purchase, inaccuracies in pricing, or errors in product information.
          </Text>
          <Text>
            4.2. <Bold>Payment Methods</Bold>: We accept various payment methods, which are displayed at checkout. By providing a payment method, you represent that you are authorized to use the payment method and you authorize us to charge your payment method for the total amount of your order (including taxes, shipping, and handling fees).
          </Text>
          <Text>
            4.3. <Bold>Payment Security</Bold>: We implement reasonable security measures to protect your payment information. However, we cannot guarantee that unauthorized third parties will not be able to defeat our security measures.
          </Text>
        </Section>

        <Section>
          <SectionTitle>5. Shipping and Delivery</SectionTitle>
          <Text>
            5.1. <Bold>Delivery Timeframes</Bold>: We provide estimated delivery times based on our carriers' normal delivery operations. However, we do not guarantee delivery within these timeframes, as various factors beyond our control can affect delivery times.
          </Text>
          <Text>
            5.2. <Bold>Shipping Costs</Bold>: Shipping costs are calculated based on the delivery location, product weight, and dimensions. These costs are displayed at checkout before you confirm your order.
          </Text>
          <Text>
            5.3. <Bold>Risk of Loss</Bold>: The risk of loss and title for products purchased from us pass to you upon our delivery to the carrier.
          </Text>
        </Section>

        <Section>
          <SectionTitle>6. Returns and Refunds</SectionTitle>
          <Text>
            Our return and refund policy is outlined in our Return Policy document. By placing an order on our Platform, you agree to the terms of our Return Policy.
          </Text>
        </Section>

        <Section>
          <SectionTitle>7. User Conduct</SectionTitle>
          <Text>
            You agree not to use our Platform for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction, including copyright or trademark laws. You are solely responsible for your conduct while using our Platform.
          </Text>
        </Section>

        <Section>
          <SectionTitle>8. Intellectual Property</SectionTitle>
          <Text>
            All content on our Platform, including text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Daraz or its content suppliers and is protected by international copyright laws. The compilation of all content on our Platform is the exclusive property of Daraz and is protected by international copyright laws.
          </Text>
        </Section>

        <Section>
          <SectionTitle>9. Limitation of Liability</SectionTitle>
          <Text>
            To the fullest extent permitted by applicable law, Daraz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with your use of our Platform.
          </Text>
        </Section>

        <Section>
          <SectionTitle>10. Indemnification</SectionTitle>
          <Text>
            You agree to indemnify, defend, and hold harmless Daraz, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of our Platform, your violation of these Terms and Conditions, or your violation of any rights of another.
          </Text>
        </Section>

        <Section>
          <SectionTitle>11. Changes to These Terms</SectionTitle>
          <Text>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our Platform. Your continued use of our Platform after such changes constitutes your acceptance of the new Terms and Conditions.
          </Text>
        </Section>

        <Section>
          <SectionTitle>12. Governing Law</SectionTitle>
          <Text>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
          </Text>
        </Section>

        <Section>
          <SectionTitle>13. Contact Information</SectionTitle>
          <Text>
            If you have any questions about these Terms and Conditions, please contact us at support@daraz.pk or through our Customer Service channels.
          </Text>
        </Section>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  padding: 40px 0;
  text-align: center;
  color: white;
`;

const HeaderTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
`;

const HeaderText = styled.p`
  font-size: 16px;
  opacity: 0.8;
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 30px ${props => props.theme.spacing.md};
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
`;

const Bold = styled.span`
  font-weight: 600;
`;

export default TermsConditions; 