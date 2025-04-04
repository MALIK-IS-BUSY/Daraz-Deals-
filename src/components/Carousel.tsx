import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Slide {
  id: number;
  image: string;
  title: string;
  url: string;
}

interface CarouselProps {
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Carousel: React.FC<CarouselProps> = ({ 
  slides, 
  autoplay = true, 
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoplay && !isHovering) {
      timer = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
          setIsAnimating(false);
        }, 300);
      }, interval);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [autoplay, interval, slides.length, isHovering]);

  const goToNextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 300);
  };

  const goToPrevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <CarouselContainer 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <SlidesContainer style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <Slide key={slide.id}>
            <SlideLink to={slide.url}>
              <SlideImage src={slide.image} alt={slide.title} />
              <SlideOverlay>
                <SlideContent className={isAnimating ? 'animating' : ''}>
                  <SlideTitle>{slide.title}</SlideTitle>
                </SlideContent>
              </SlideOverlay>
            </SlideLink>
          </Slide>
        ))}
      </SlidesContainer>
      
      <ControlButton position="left" onClick={goToPrevSlide}>
        <FaChevronLeft />
      </ControlButton>
      
      <ControlButton position="right" onClick={goToNextSlide}>
        <FaChevronRight />
      </ControlButton>
      
      <Indicators>
        {slides.map((_, index) => (
          <Indicator 
            key={index} 
            active={index === currentSlide}
            onClick={() => goToSlide(index)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 250px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    height: 200px;
  }
`;

const SlidesContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  position: relative;
`;

const SlideLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const SlideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 70%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
`;

const SlideContent = styled.div`
  transform: translateY(0);
  opacity: 1;
  transition: all 0.5s ease;
  animation: ${fadeIn} 0.5s ease;
  
  &.animating {
    opacity: 0;
    transform: translateY(10px);
  }
`;

const SlideTitle = styled.h3`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 18px;
  }
`;

const ControlButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: 15px;' : 'right: 15px;'}
  background-color: rgba(255, 255, 255, 0.9);
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  ${CarouselContainer}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background-color: white;
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 30px;
    height: 30px;
    ${props => props.position === 'left' ? 'left: 10px;' : 'right: 10px;'}
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    bottom: 15px;
  }
`;

const Indicator = styled.div<{ active: boolean }>`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: white;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    height: 6px;
    width: ${props => props.active ? '20px' : '6px'};
  }
`;

export default Carousel;