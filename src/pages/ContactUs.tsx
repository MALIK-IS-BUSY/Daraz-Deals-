import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server
    setSubmitted(true);
    // Reset form after submission
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    
    // Reset the submitted state after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Container>
      <PageHeader>
        <HeaderTitle>Contact Us</HeaderTitle>
        <HeaderText>We're here to help with any questions or concerns</HeaderText>
      </PageHeader>

      <Content>
        <ContactInfoSection>
          <SectionTitle>Contact Information</SectionTitle>
          <ContactInfoGrid>
            <InfoCard>
              <InfoIcon>
                <FaMapMarkerAlt />
              </InfoIcon>
              <InfoTitle>Office Address</InfoTitle>
              <InfoText>
                Daraz Pakistan, 4th Floor, Liberty Tower, <br />
                Main Boulevard Gulberg, Lahore, Pakistan
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoIcon>
                <FaPhone />
              </InfoIcon>
              <InfoTitle>Phone Support</InfoTitle>
              <InfoText>+92-42-111-222-333</InfoText>
              <InfoSubText>Mon-Sat, 9am to 6pm</InfoSubText>
            </InfoCard>

            <InfoCard>
              <InfoIcon>
                <FaEnvelope />
              </InfoIcon>
              <InfoTitle>Email</InfoTitle>
              <InfoText>support@daraz.pk</InfoText>
              <InfoSubText>We reply within 24 hours</InfoSubText>
            </InfoCard>

            <InfoCard>
              <InfoIcon>
                <FaClock />
              </InfoIcon>
              <InfoTitle>Working Hours</InfoTitle>
              <InfoText>Monday - Saturday: 9:00 AM - 6:00 PM</InfoText>
              <InfoSubText>Closed on Sundays and Public Holidays</InfoSubText>
            </InfoCard>
          </ContactInfoGrid>
        </ContactInfoSection>

        <FormSection>
          <SectionTitle>Send Us a Message</SectionTitle>
          
          {submitted ? (
            <SuccessMessage>
              <FaCheckCircle />
              <p>Thank you for contacting us! We'll get back to you shortly.</p>
            </SuccessMessage>
          ) : (
            <ContactForm onSubmit={handleSubmit}>
              <InputGroup>
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject"
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="message">Message</Label>
                <TextArea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </InputGroup>
              
              <SubmitButton type="submit">Send Message</SubmitButton>
            </ContactForm>
          )}
        </FormSection>
      </Content>
      
      <MapSection>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3427.1202150842517!2d74.3372699!3d31.515689999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904b3ab6414c7%3A0xf70c8bca5b97a304!2sLiberty%20Tower%2C%20Gulberg%20III%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1658395694288!5m2!1sen!2s" 
          width="100%" 
          height="450" 
          style={{ border: 0 }}
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Daraz Office Location"
        />
      </MapSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  padding: 50px 0;
  text-align: center;
  color: white;
`;

const HeaderTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
`;

const HeaderText = styled.p`
  font-size: 18px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px ${props => props.theme.spacing.md};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    padding: 30px ${props => props.theme.spacing.md};
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
`;

const ContactInfoSection = styled.div``;

const ContactInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoIcon = styled.div`
  font-size: 24px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const InfoText = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
`;

const InfoSubText = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  margin-top: 5px;
`;

const FormSection = styled.div``;

const ContactForm = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 15px;
  resize: vertical;
  min-height: 150px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 25px;
  
  svg {
    color: #4caf50;
    font-size: 24px;
    margin-right: 15px;
  }
  
  p {
    font-size: 16px;
    color: #2e7d32;
  }
`;

const MapSection = styled.div`
  width: 100%;
  margin-top: 50px;
`;

export default ContactUs; 