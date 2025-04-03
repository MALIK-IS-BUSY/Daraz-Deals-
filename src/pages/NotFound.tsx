import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound: React.FC = () => {
  return (
    <Container>
      <Content>
        <ErrorCode>404</ErrorCode>
        <Title>Page Not Found</Title>
        <Description>
          Oops! The page you are looking for doesn't exist or has been moved.
        </Description>
        <ButtonsContainer>
          <HomeButton to="/">
            <FaHome /> Go to Homepage
          </HomeButton>
          <SearchButton to="/">
            <FaSearch /> Search Products
          </SearchButton>
        </ButtonsContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px ${props => props.theme.spacing.md};
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 300px);
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: 900;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  line-height: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 80px;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 20px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const HomeButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const SearchButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

export default NotFound; 