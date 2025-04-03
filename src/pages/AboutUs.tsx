import React from 'react';
import styled from 'styled-components';
import { FaUsers, FaCertificate, FaHandshake, FaGlobe } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  return (
    <Container>
      <PageHeader>
        <HeaderTitle>About Daraz Deals</HeaderTitle>
        <HeaderText>Pakistan's Leading Online Marketplace</HeaderText>
      </PageHeader>

      <Content>
        <Section>
          <SectionTitle>Our Story</SectionTitle>
          <Text>
            Founded in 2015, Daraz has grown from a small e-commerce startup to Pakistan's leading online marketplace, connecting millions of shoppers with thousands of sellers across the country. Today, Daraz is part of the Alibaba Group, benefiting from the expertise and resources of one of the world's largest e-commerce companies.
          </Text>
          <Text>
            What started with a team of 10 people has now grown to over 3,000 employees working across Pakistan, Bangladesh, Sri Lanka, Nepal, and Myanmar. Despite our growth, our mission remains the same: to make online shopping accessible, affordable, and enjoyable for everyone.
          </Text>
        </Section>

        <Grid>
          <GridItem>
            <ValueIcon>
              <FaUsers />
            </ValueIcon>
            <ValueTitle>Customer First</ValueTitle>
            <ValueText>
              We put our customers at the center of everything we do, continually innovating to enhance their shopping experience and meet their evolving needs.
            </ValueText>
          </GridItem>

          <GridItem>
            <ValueIcon>
              <FaCertificate />
            </ValueIcon>
            <ValueTitle>Excellence</ValueTitle>
            <ValueText>
              We strive for excellence in all aspects of our business, from the quality of products on our platform to the service we provide to our customers and partners.
            </ValueText>
          </GridItem>

          <GridItem>
            <ValueIcon>
              <FaHandshake />
            </ValueIcon>
            <ValueTitle>Collaboration</ValueTitle>
            <ValueText>
              We believe in the power of collaboration and work closely with our sellers, partners, and employees to create a thriving e-commerce ecosystem.
            </ValueText>
          </GridItem>

          <GridItem>
            <ValueIcon>
              <FaGlobe />
            </ValueIcon>
            <ValueTitle>Innovation</ValueTitle>
            <ValueText>
              We continuously innovate to stay ahead of the curve and provide cutting-edge solutions to meet the challenges of the e-commerce industry.
            </ValueText>
          </GridItem>
        </Grid>

        <Section>
          <SectionTitle>Our Vision</SectionTitle>
          <Text>
            At Daraz, our vision is to be the leading e-commerce platform in South Asia, empowering local businesses to reach a wider audience while providing customers with a seamless and enjoyable shopping experience. We aim to push the boundaries of what's possible in e-commerce, leveraging technology to create innovative solutions that benefit all our stakeholders.
          </Text>
        </Section>

        <ImageSection>
          <Image src="/daraz-team.jpg" alt="Daraz Team" />
        </ImageSection>

        <Section>
          <SectionTitle>Empowering Local Entrepreneurs</SectionTitle>
          <Text>
            Daraz is committed to supporting and empowering local entrepreneurs and businesses. Through our platform, we provide small and medium enterprises with the tools, resources, and exposure they need to reach a wider customer base and grow their businesses. We offer training programs, marketing support, and logistics solutions to help our sellers succeed in the competitive e-commerce landscape.
          </Text>
          <Text>
            Our Daraz University initiative has trained over 10,000 sellers, equipping them with the knowledge and skills needed to thrive in the digital economy. We're proud to contribute to the economic development of the regions we serve by creating opportunities for entrepreneurship and job creation.
          </Text>
        </Section>

        <StatsSection>
          <StatItem>
            <StatNumber>10M+</StatNumber>
            <StatText>Active Customers</StatText>
          </StatItem>
          <StatItem>
            <StatNumber>100K+</StatNumber>
            <StatText>Sellers</StatText>
          </StatItem>
          <StatItem>
            <StatNumber>25M+</StatNumber>
            <StatText>Products</StatText>
          </StatItem>
          <StatItem>
            <StatNumber>5</StatNumber>
            <StatText>Countries</StatText>
          </StatItem>
        </StatsSection>

        <Section>
          <SectionTitle>Community Impact</SectionTitle>
          <Text>
            Beyond business, we're dedicated to making a positive impact in the communities we serve. Through our CSR initiatives, we support education, environmental sustainability, and disaster relief efforts. During the COVID-19 pandemic, we worked with government agencies and NGOs to deliver essential supplies to those in need and supported small businesses affected by the crisis.
          </Text>
          <Text>
            We believe that business can be a force for good, and we're committed to operating in a way that benefits not just our customers and partners, but also society at large.
          </Text>
        </Section>

        <JoinSection>
          <JoinTitle>Join Our Team</JoinTitle>
          <JoinText>
            We're always looking for talented individuals to join our team. If you're passionate about e-commerce and want to be part of a dynamic and diverse company that's transforming the way people shop in South Asia, check out our careers page.
          </JoinText>
          <JoinButton href="/careers">View Career Opportunities</JoinButton>
        </JoinSection>
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
  padding: 60px 0;
  text-align: center;
  color: white;
`;

const HeaderTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 15px;
`;

const HeaderText = styled.p`
  font-size: 18px;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 30px ${props => props.theme.spacing.md};
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin: 40px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ValueIcon = styled.div`
  font-size: 30px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const ValueTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const ValueText = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.5;
`;

const ImageSection = styled.div`
  margin: 40px 0;
  text-align: center;
`;

const Image = styled.img`
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 50px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-basis: 50%;
    margin-bottom: 20px;
  }
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 5px;
`;

const StatText = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const JoinSection = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-top: 50px;
`;

const JoinTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const JoinText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const JoinButton = styled.a`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

export default AboutUs; 