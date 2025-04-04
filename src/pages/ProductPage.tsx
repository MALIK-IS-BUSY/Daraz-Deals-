import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt, FaRegStar, FaExternalLinkAlt, FaArrowRight, FaTruck, FaShieldAlt, FaUndo, FaCreditCard } from 'react-icons/fa';
import { getProductBySlug, getProductsByCategory } from '../services/productService';
import { getCategoryById } from '../services/categoryService';
import { Product } from '../types/product';
import { formatPrice, formatDate } from '../utils/format';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const fetchedProduct = await getProductBySlug(slug);
        
        if (!fetchedProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images[0] || '');
        
        // Fetch category name
        try {
          const category = await getCategoryById(fetchedProduct.categoryId);
          if (category) {
            setCategoryName(category.name);
          }
        } catch (err) {
          console.error('Error fetching category:', err);
        }
        
        // Fetch related products from the same category
        const { products: relatedProductsData } = await getProductsByCategory(fetchedProduct.categoryId);
        
        // Filter out the current product and limit to 4 items
        const filteredRelatedProducts = relatedProductsData
          .filter(p => p.id !== fetchedProduct.id)
          .slice(0, 4);
        setRelatedProducts(filteredRelatedProducts);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleImageChange = (image: string) => {
    setSelectedImage(image);
  };

  const handleAffiliateRedirect = () => {
    if (product?.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank');
    } else {
      alert('Affiliate link not available for this product.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !product) {
    return <ErrorMessage>{error || 'Product not found'}</ErrorMessage>;
  }

  // Calculate full stars, half stars, and empty stars for rating
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/')}>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem onClick={() => navigate(`/category/${product.categoryId}`)}>
          {categoryName || 'Category'}
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItemActive>{product.title}</BreadcrumbItemActive>
      </Breadcrumb>

      <ProductDetail>
        <ProductGallery>
          <MainImage>
            <img src={selectedImage || 'https://via.placeholder.com/500'} alt={product.title} />
            {discountPercentage > 0 && (
              <DiscountBadge>-{discountPercentage}%</DiscountBadge>
            )}
          </MainImage>
          <ThumbnailContainer>
            {product.images.map((image, index) => (
              <Thumbnail 
                key={index}
                active={image === selectedImage}
                onClick={() => handleImageChange(image)}
              >
                <img src={image} alt={`${product.title} - Image ${index + 1}`} />
              </Thumbnail>
            ))}
          </ThumbnailContainer>
        </ProductGallery>

        <ProductInfo>
          <ProductTitle>{product.title}</ProductTitle>
          
          <ProductMeta>
            <RatingContainer>
              <Stars>
                {[...Array(fullStars)].map((_, i) => (
                  <FaStar key={`full-${i}`} color="#ffc907" />
                ))}
                {hasHalfStar && <FaStarHalfAlt color="#ffc907" />}
                {[...Array(emptyStars)].map((_, i) => (
                  <FaRegStar key={`empty-${i}`} color="#ffc907" />
                ))}
              </Stars>
              <RatingValue>{product.rating.toFixed(1)}</RatingValue>
              <ReviewCount>({product.reviews.length} reviews)</ReviewCount>
            </RatingContainer>
            
            {product.brand && (
              <BrandInfo>
                Brand: <BrandName>{product.brand}</BrandName>
                <BrandNameLink href="#" onClick={(e) => {
                  e.preventDefault();
                  navigate(`/search?brand=${encodeURIComponent(product.brand || '')}`);
                }}>View all products</BrandNameLink>
              </BrandInfo>
            )}
          </ProductMeta>
          
          <PriceContainer>
            {product.discountPrice ? (
              <>
                <CurrentPrice>{formatPrice(product.discountPrice)}</CurrentPrice>
                <OriginalPrice>{formatPrice(product.price)}</OriginalPrice>
                <DiscountTag>
                  You save {formatPrice(product.price - (product.discountPrice || 0))} ({discountPercentage}%)
                </DiscountTag>
              </>
            ) : (
              <CurrentPrice>{formatPrice(product.price)}</CurrentPrice>
            )}
          </PriceContainer>
          
          <StockInfo available={product.stockQuantity > 0}>
            {product.stockQuantity > 0 
              ? `In Stock (${product.stockQuantity} available)` 
              : 'Out of Stock'}
          </StockInfo>
          
          <Description>{product.description}</Description>
          
          {product.features && product.features.length > 0 && (
            <Section>
              <SectionTitle>Key Features</SectionTitle>
              <FeaturesList>
                {product.features.map((feature, index) => (
                  <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
              </FeaturesList>
            </Section>
          )}
          
          <ActionButton 
            onClick={handleAffiliateRedirect} 
            disabled={!product.affiliateUrl}
          >
            Buy on Daraz <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
          </ActionButton>
          
          <ServicesInfo>
            <ServiceItem>
              <FaTruck />
              <ServiceText>
                <strong>Free Delivery</strong>
                <span>Fast delivery 3-5 days</span>
              </ServiceText>
            </ServiceItem>
            <ServiceItem>
              <FaShieldAlt />
              <ServiceText>
                <strong>1 Year Warranty</strong>
                <span>Official warranty</span>
              </ServiceText>
            </ServiceItem>
            <ServiceItem>
              <FaUndo />
              <ServiceText>
                <strong>7 Days Return</strong>
                <span>If goods have problems</span>
              </ServiceText>
            </ServiceItem>
            <ServiceItem>
              <FaCreditCard />
              <ServiceText>
                <strong>Secure Payment</strong>
                <span>100% secure payment</span>
              </ServiceText>
            </ServiceItem>
          </ServicesInfo>
        </ProductInfo>
      </ProductDetail>

      <TabsSection>
        <TabsHeader>
          <TabItem active={true}>Description</TabItem>
          <TabItem active={false}>Specifications</TabItem>
          <TabItem active={false}>Reviews ({product.reviews.length})</TabItem>
        </TabsHeader>
        
        <TabContent>
          <DetailedDescription>
            <p>{product.description}</p>
            {product.features && (
              <>
                <h3>Key Features:</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </DetailedDescription>
        </TabContent>
      </TabsSection>

      <Section>
        <SectionTitle>Customer Reviews ({product.reviews.length})</SectionTitle>
        {product.reviews.length > 0 ? (
          <ReviewsList>
            {product.reviews.map((review) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <ReviewAuthor>{review.userName}</ReviewAuthor>
                  <ReviewDate>{formatDate(review.date)}</ReviewDate>
                </ReviewHeader>
                <ReviewRating>
                  {[...Array(5)].map((_, index) => (
                    <FaStar 
                      key={index} 
                      color={index < review.rating ? '#ffc907' : '#e0e0e0'} 
                    />
                  ))}
                </ReviewRating>
                <ReviewComment>{review.comment}</ReviewComment>
              </ReviewItem>
            ))}
          </ReviewsList>
        ) : (
          <NoReviews>No reviews yet. Be the first to review this product!</NoReviews>
        )}
      </Section>

      {relatedProducts.length > 0 && (
        <RelatedProductsSection>
          <RelatedProductsHeader>
            <SectionTitle>Similar Products You May Like</SectionTitle>
            <ViewAllButton onClick={() => navigate(`/category/${product.categoryId}`)}>
              View All <FaArrowRight />
            </ViewAllButton>
          </RelatedProductsHeader>
          <RelatedProductsGrid>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </RelatedProductsGrid>
        </RelatedProductsSection>
      )}
    </Container>
  );
};

// Styled Components - I'm updating only the new ones and modifying existing ones
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px ${props => props.theme.spacing.md};
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
`;

const BreadcrumbItem = styled.span`
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 10px;
`;

const BreadcrumbItemActive = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const ProductDetail = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 500px) 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ProductGallery = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImage = styled.div`
  position: relative;
  margin-bottom: 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 5px 10px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 600;
  font-size: 14px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  
  &::-webkit-scrollbar {
    height: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.lightGray};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.mediumGray};
    border-radius: 10px;
  }
`;

const Thumbnail = styled.div<{ active: boolean }>`
  width: 70px;
  height: 70px;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  line-height: 1.3;
`;

const ProductMeta = styled.div`
  margin-bottom: 15px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const RatingValue = styled.span`
  margin-left: 10px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ReviewCount = styled.span`
  margin-left: 5px;
  color: ${props => props.theme.colors.lightText};
`;

const BrandInfo = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
`;

const BrandName = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  margin-right: 10px;
`;

const BrandNameLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PriceContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const CurrentPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const OriginalPrice = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
  margin-top: 5px;
`;

const DiscountTag = styled.div`
  display: inline-block;
  margin-top: 8px;
  background-color: #fff0e6;
  color: ${props => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 14px;
  font-weight: 500;
`;

const StockInfo = styled.div<{ available: boolean }>`
  color: ${props => props.available ? props.theme.colors.success : props.theme.colors.error};
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin: 30px 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const FeaturesList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 20px;
`;

const FeatureItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ServicesInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  
  svg {
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
    margin-right: 10px;
  }
`;

const ServiceText = styled.div`
  display: flex;
  flex-direction: column;
  
  strong {
    font-weight: 600;
    font-size: 14px;
  }
  
  span {
    font-size: 12px;
    color: ${props => props.theme.colors.lightText};
  }
`;

const TabsSection = styled.div`
  margin: 40px 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const TabsHeader = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.lightGray};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TabItem = styled.div<{ active: boolean }>`
  padding: 15px 25px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled.div`
  padding: 20px;
`;

const DetailedDescription = styled.div`
  line-height: 1.8;
  
  p {
    margin-bottom: 20px;
  }
  
  h3 {
    margin: 20px 0 10px;
    font-weight: 600;
  }
  
  ul {
    padding-left: 20px;
    margin-bottom: 20px;
  }
  
  li {
    margin-bottom: 8px;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReviewItem = styled.div`
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ReviewAuthor = styled.div`
  font-weight: 600;
`;

const ReviewDate = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
`;

const ReviewRating = styled.div`
  margin-bottom: 10px;
  
  svg {
    margin-right: 2px;
  }
`;

const ReviewComment = styled.div`
  line-height: 1.6;
`;

const NoReviews = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.lightText};
`;

const RelatedProductsSection = styled.div`
  margin-top: 40px;
`;

const RelatedProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RelatedProductsGrid = styled.div`
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

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: ${props => props.theme.colors.error};
`;

export default ProductPage; 