import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { Product } from '../types/product';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { FaBolt, FaClock } from 'react-icons/fa';

const FlashDeals: React.FC = () => {
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const fetchFlashDeals = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getAllProducts();
        
        // Filter products with highest discount
        const deals = allProducts
          .filter(product => product.discountPrice && product.discountPrice < product.price)
          .sort((a, b) => {
            const discountA = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
            const discountB = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
            return discountB - discountA;
          })
          .slice(0, 12); // Show top 12 deals
        
        setFlashDeals(deals);
        setError(null);
      } catch (err) {
        console.error('Error fetching flash deals:', err);
        setError('Failed to load flash deals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashDeals();

    // Set up countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Reset the timer when it reaches zero
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <FlashHeader>
        <Logo>
          <FaBolt /> Flash Sale
        </Logo>
        <CountdownContainer>
          <CountdownLabel>Ends in:</CountdownLabel>
          <Countdown>
            <TimeUnit>
              <TimeValue>{timeLeft.hours.toString().padStart(2, '0')}</TimeValue>
              <TimeLabel>Hours</TimeLabel>
            </TimeUnit>
            <Separator>:</Separator>
            <TimeUnit>
              <TimeValue>{timeLeft.minutes.toString().padStart(2, '0')}</TimeValue>
              <TimeLabel>Minutes</TimeLabel>
            </TimeUnit>
            <Separator>:</Separator>
            <TimeUnit>
              <TimeValue>{timeLeft.seconds.toString().padStart(2, '0')}</TimeValue>
              <TimeLabel>Seconds</TimeLabel>
            </TimeUnit>
          </Countdown>
        </CountdownContainer>
      </FlashHeader>

      <BannerSection>
        <FlashBanner>
          <BannerContent>
            <BannerTitle>Flash Sale is Live!</BannerTitle>
            <BannerText>Up to 70% OFF on top products. Limited time offer, while supplies last.</BannerText>
            <ClockIcon>
              <FaClock />
            </ClockIcon>
          </BannerContent>
        </FlashBanner>
      </BannerSection>

      <Content>
        <SectionTitle>Today's Flash Deals</SectionTitle>
        {flashDeals.length > 0 ? (
          <ProductGrid>
            {flashDeals.map(product => (
              <ProductCardWrapper key={product.id}>
                <FlashTag>
                  <FaBolt /> Flash Deal
                </FlashTag>
                <ProductCard product={product} />
              </ProductCardWrapper>
            ))}
          </ProductGrid>
        ) : (
          <NoResults>
            <p>No flash deals available at the moment. Check back soon!</p>
            <BackButton as={Link} to="/">Back to Homepage</BackButton>
          </NoResults>
        )}
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const FlashHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 15px;
    padding: 15px 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 28px;
  font-weight: 700;
  padding: 0 ${props => props.theme.spacing.md};
  
  svg {
    margin-right: 10px;
    animation: ${keyframes`
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    `} 1.5s infinite;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const CountdownLabel = styled.div`
  color: white;
  font-size: 16px;
  margin-right: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const Countdown = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 6px;
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
`;

const TimeValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const TimeLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const Separator = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 5px;
`;

const BannerSection = styled.div`
  padding: 20px ${props => props.theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
`;

const FlashBanner = styled.div`
  background: linear-gradient(135deg, #f5515f 0%, #9f041b 100%);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const BannerContent = styled.div`
  padding: 30px;
  color: white;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 20px;
  }
`;

const BannerTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const BannerText = styled.p`
  font-size: 16px;
  max-width: 70%;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    max-width: 100%;
  }
`;

const ClockIcon = styled.div`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 80px;
  opacity: 0.2;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProductCardWrapper = styled.div`
  position: relative;
`;

const pulse = keyframes`
  0% { background-color: #f5515f; }
  50% { background-color: #ff7c89; }
  100% { background-color: #f5515f; }
`;

const FlashTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #f5515f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  z-index: 1;
  animation: ${pulse} 2s infinite;
  
  svg {
    margin-right: 5px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 50px 0;
  
  p {
    font-size: 16px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 20px;
  }
`;

const BackButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: ${props => props.theme.colors.error};
`;

export default FlashDeals; 