import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
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

const Carousel: React.FC<CarouselProps> = ({ 
  slides, 
  autoplay = true, 
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoplay && !isHovering) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, interval);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [autoplay, interval, slides.length, isHovering]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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
                <SlideTitle>{slide.title}</SlideTitle>
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
  transition: transform 0.5s ease;
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
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
`;

const SlideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
`;

const SlideTitle = styled.h3`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 18px;
  }
`;

const ControlButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: 10px;' : 'right: 10px;'}
  background-color: rgba(255, 255, 255, 0.7);
  color: ${props => props.theme.colors.text};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  
  ${CarouselContainer}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background-color: white;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Indicator = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: white;
  }
`;

export default Carousel; 