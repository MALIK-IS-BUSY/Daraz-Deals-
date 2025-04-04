import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { Product } from '../types/product';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, description, slug, price, discountPrice, images, rating } = product;
  
  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;
  
  // Get first line of description
  const shortDescription = description.split('\n')[0].substring(0, 60) + '...';
  
  return (
    <CardContainer>
      <CardImage>
        <img 
          src={images.length > 0 ? images[0] : 'https://via.placeholder.com/300'}
          alt={title} 
        />
        {discountPercentage > 0 && (
          <DiscountBadge>-{discountPercentage}%</DiscountBadge>
        )}
        <ActionButtons>
          <AddToCartButton as={Link} to={`/product/${slug}`}>
            <FaShoppingCart />
          </AddToCartButton>
        </ActionButtons>
      </CardImage>
      
      <CardContent>
        <ProductTitle>{title}</ProductTitle>
        <ProductDescription>{shortDescription}</ProductDescription>
        
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const CardContainer = styled.div`
  display: block;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CardImage = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  ${CardContainer}:hover img {
    transform: scale(1.1);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff5e5e, #ff2d2d);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  ${CardContainer}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AddToCartButton = styled(Link)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 14px;
  background-color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    animation: ${pulse} 0.5s ease;
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const ProductTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceContainer = styled.div`
  margin-bottom: 12px;
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
  gap: 6px;
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