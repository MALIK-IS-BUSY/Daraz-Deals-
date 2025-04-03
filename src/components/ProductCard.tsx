import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import { Product } from '../types/product';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, slug, price, discountPrice, images, rating } = product;
  
  // Calculate discount percentage
  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;
  
  return (
    <CardContainer to={`/product/${slug}`}>
      <CardImage>
        <img 
          src={images.length > 0 ? images[0] : 'https://via.placeholder.com/300'}
          alt={title} 
        />
        {discountPercentage > 0 && (
          <DiscountBadge>-{discountPercentage}%</DiscountBadge>
        )}
      </CardImage>
      
      <CardContent>
        <ProductTitle>{title}</ProductTitle>
        
        <PriceContainer>
          {discountPrice ? (
            <>
              <CurrentPrice>{formatPrice(discountPrice)}</CurrentPrice>
              <OriginalPrice>{formatPrice(price)}</OriginalPrice>
            </>
          ) : (
            <CurrentPrice>{formatPrice(price)}</CurrentPrice>
          )}
        </PriceContainer>
        
        <Rating>
          <RatingStars>
            {[...Array(5)].map((_, index) => (
              <Star key={index} filled={index < Math.floor(rating)} />
            ))}
          </RatingStars>
          <RatingValue>({rating.toFixed(1)})</RatingValue>
        </Rating>
      </CardContent>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  display: block;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${CardContainer}:hover img {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.colors.error};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 44px;
`;

const PriceContainer = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrentPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  text-decoration: line-through;
  color: ${props => props.theme.colors.darkGray};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled(FaStar)<{ filled: boolean }>`
  color: ${props => props.filled ? props.theme.colors.accent : props.theme.colors.mediumGray};
  font-size: 14px;
  margin-right: 2px;
`;

const RatingValue = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.darkGray};
`;

export default ProductCard; 