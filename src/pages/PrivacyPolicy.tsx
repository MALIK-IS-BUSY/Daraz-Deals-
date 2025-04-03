import React from 'react';
import styled from 'styled-components';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container>
      <PageHeader>
        <HeaderTitle>Privacy Policy</HeaderTitle>
        <HeaderText>Last Updated: November 1, 2023</HeaderText>
      </PageHeader>

      <Content>
        <Section>
          <SectionTitle>1. Introduction</SectionTitle>
          <Text>
            At Daraz, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile application (collectively, the "Platform").
          </Text>
          <Text>
            Please read this Privacy Policy carefully. By accessing or using our Platform, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree with our policies and practices, do not use our Platform.
          </Text>
        </Section>

        <Section>
          <SectionTitle>2. Information We Collect</SectionTitle>
          <Text>
            We collect various types of information from and about users of our Platform, including:
          </Text>
          <List>
            <ListItem>
              <Bold>Personal Information</Bold>: Information that identifies you such as your name, email address, postal address, phone number, payment information, and any other identifier by which you may be contacted online or offline.
            </ListItem>
            <ListItem>
              <Bold>Usage Information</Bold>: Information about your internet connection, the equipment you use to access our Platform, and usage details such as traffic data, logs, and other communication data.
            </ListItem>
            <ListItem>
              <Bold>Location Information</Bold>: Information about your location, which we may collect through GPS, IP address, and other technologies.
            </ListItem>
            <ListItem>
              <Bold>Transaction Information</Bold>: Details of purchases you make on our Platform, including the products purchased, payment method, and delivery address.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. How We Collect Information</SectionTitle>
          <Text>
            We collect information through:
          </Text>
          <List>
            <ListItem>
              <Bold>Direct Interactions</Bold>: Information you provide when you register for an account, place an order, contact customer service, or otherwise interact with our Platform.
            </ListItem>
            <ListItem>
              <Bold>Automated Technologies</Bold>: As you use our Platform, we may use cookies, web beacons, pixel tags, and other tracking technologies to collect information about your browsing actions and patterns.
            </ListItem>
            <ListItem>
              <Bold>Third Parties</Bold>: We may receive information about you from third parties such as business partners, social media platforms, and analytics providers.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. How We Use Your Information</SectionTitle>
          <Text>
            We use the information we collect about you or that you provide to us, including any personal information, for the following purposes:
          </Text>
          <List>
            <ListItem>To provide and maintain our Platform</ListItem>
            <ListItem>To process and fulfill your orders</ListItem>
            <ListItem>To personalize your experience on our Platform</ListItem>
            <ListItem>To communicate with you about orders, promotions, and other updates</ListItem>
            <ListItem>To improve our Platform and customer service</ListItem>
            <ListItem>To process payments and prevent fraud</ListItem>
            <ListItem>To comply with legal obligations</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>5. Disclosure of Your Information</SectionTitle>
          <Text>
            We may disclose your personal information to:
          </Text>
          <List>
            <ListItem>
              <Bold>Service Providers</Bold>: Third-party vendors who perform services on our behalf, such as payment processing, order fulfillment, data analysis, email delivery, and customer service.
            </ListItem>
            <ListItem>
              <Bold>Business Partners</Bold>: When you make purchases through our Platform, we may share your information with the sellers to facilitate your transaction.
            </ListItem>
            <ListItem>
              <Bold>Legal Authorities</Bold>: When required by law or to protect our rights, property, or safety, or the rights, property, or safety of others.
            </ListItem>
            <ListItem>
              <Bold>Corporate Transactions</Bold>: In connection with a corporate merger, consolidation, sale of assets, or other corporate change.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Your Choices</SectionTitle>
          <Text>
            You can control the information we collect by:
          </Text>
          <List>
            <ListItem>
              <Bold>Account Settings</Bold>: You can review and change your personal information by logging into your account and visiting your account profile page.
            </ListItem>
            <ListItem>
              <Bold>Cookies</Bold>: You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent.
            </ListItem>
            <ListItem>
              <Bold>Marketing Communications</Bold>: You can opt out of receiving marketing emails from us by following the unsubscribe link in these emails.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. Data Security</SectionTitle>
          <Text>
            We have implemented reasonable measures to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </Text>
        </Section>

        <Section>
          <SectionTitle>8. Children's Privacy</SectionTitle>
          <Text>
            Our Platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are under 13, do not use or provide any information on our Platform.
          </Text>
        </Section>

        <Section>
          <SectionTitle>9. International Users</SectionTitle>
          <Text>
            If you are accessing our Platform from outside Pakistan, your information may be transferred to, stored, and processed in Pakistan and other countries where our servers are located. By using our Platform, you consent to the transfer of your information to countries which may have different data protection rules than your country.
          </Text>
        </Section>

        <Section>
          <SectionTitle>10. Changes to Our Privacy Policy</SectionTitle>
          <Text>
            We may update our Privacy Policy from time to time. If we make material changes, we will notify you by email or through a notice on our Platform. Your continued use of our Platform after such changes indicates your acceptance of the revised Privacy Policy.
          </Text>
        </Section>

        <Section>
          <SectionTitle>11. Contact Information</SectionTitle>
          <Text>
            If you have any questions or concerns about our Privacy Policy or our practices regarding your personal information, please contact us at:
          </Text>
          <ContactInfo>
            <div>Email: privacy@daraz.pk</div>
            <div>Address: 4th Floor, Liberty Tower, Main Boulevard Gulberg, Lahore, Pakistan</div>
            <div>Phone: +92-42-111-222-333</div>
          </ContactInfo>
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

const List = styled.ul`
  margin-bottom: 15px;
  padding-left: 20px;
`;

const ListItem = styled.li`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
`;

const Bold = styled.span`
  font-weight: 600;
`;

const ContactInfo = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 20px;
  border-radius: 6px;
  margin-top: 15px;
  
  div {
    margin-bottom: 8px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
  }
  
  div:last-child {
    margin-bottom: 0;
  }
`;

export default PrivacyPolicy; 