import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  fullScreen = false,
  text
}) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <SpinnerContainer>
        <SpinnerRing size={size} />
        <SpinnerLogo size={size}>D</SpinnerLogo>
        {text && <LoadingText>{text}</LoadingText>}
      </SpinnerContainer>
    </SpinnerWrapper>
  );
};

// Size configurations
const sizeMap = {
  small: {
    outer: '40px',
    inner: '20px',
    fontSize: '12px',
    textSize: '14px'
  },
  medium: {
    outer: '60px',
    inner: '30px',
    fontSize: '18px',
    textSize: '16px'
  },
  large: {
    outer: '80px',
    inner: '40px',
    fontSize: '24px',
    textSize: '18px'
  }
};

// Animations
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(0.95);
  }
`;

// Styled components
const SpinnerWrapper = styled.div<{ fullScreen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ fullScreen }) => fullScreen ? '100vh' : '200px'};
  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.85);
    z-index: 1000;
  `}
`;

const SpinnerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SpinnerRing = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  width: ${props => sizeMap[props.size].outer};
  height: ${props => sizeMap[props.size].outer};
  border: 3px solid ${props => props.theme.colors.background};
  border-radius: 50%;
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-right: 3px solid ${props => props.theme.colors.secondary};
  border-bottom: 3px solid ${props => props.theme.colors.accent};
  animation: ${rotate} 1.5s linear infinite;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
`;

const SpinnerLogo = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  position: absolute;
  width: ${props => sizeMap[props.size].inner};
  height: ${props => sizeMap[props.size].inner};
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: ${props => sizeMap[props.size].fontSize};
  color: ${props => props.theme.colors.primary};
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled.div`
  margin-top: 20px;
  font-size: ${props => sizeMap.medium.textSize};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

export default Spinner; 