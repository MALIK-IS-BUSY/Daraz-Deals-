import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getAllProducts, getProductsByCategory } from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import { Product } from '../types/product';
import { Category } from '../types/category';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import Spinner from '../components/Spinner';
import { FaTruck, FaShieldAlt, FaCreditCard, FaHeadset, FaArrowRight } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<{[key: string]: Product[]}>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all products
        const allProducts = await getAllProducts();
        
        // Sort products by date (newest first)
        const sortedProducts = [...allProducts].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        
        // New arrivals (8 newest products)
        setNewArrivals(sortedProducts.slice(0, 8));
        
        // Featured products (popular products based on rating)
        const featured = [...allProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        setFeaturedProducts(featured);
        
        // Discounted products
        const discounted = allProducts
          .filter(product => product.discountPrice !== null && product.discountPrice !== undefined)
          .sort((a, b) => {
            const discountA = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
            const discountB = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
            return discountB - discountA;
          })
          .slice(0, 4);
        setDiscountedProducts(discounted);
        
        // Fetch categories
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
        
        // Fetch products by category
        const categoryProductsMap: {[key: string]: Product[]} = {};
        for (const category of fetchedCategories) {
          const products = allProducts
            .filter(product => product.categoryId === category.id)
            .slice(0, 4);
          categoryProductsMap[category.id] = products;
        }
        setCategorizedProducts(categoryProductsMap);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const heroSlides = [
    {
      id: 1,
      image: '/daraz-1.jpg',
      title: 'Shop the Latest Products',
      url: '/category/electronics'
    },
    {
      id: 2,
      image: '/daraz-2.jpg',
      title: 'Exclusive Discounts',
      url: '/category/fashion'
    },
    {
      id: 3,
      image: '/daraz-3.jpg',
      title: 'New Arrivals',
      url: '/category/home'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <Carousel slides={heroSlides} />
      </HeroSection>

      <Container>
        <FeaturesStrip>
          <FeatureItem>
            <FeatureIcon>
              <FaTruck />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Free Shipping</FeatureTitle>
              <FeatureDescription>On orders over Rs 2,000</FeatureDescription>
            </FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <FaShieldAlt />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Secure Payment</FeatureTitle>
              <FeatureDescription>100% secure payment</FeatureDescription>
            </FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <FaCreditCard />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>Easy Returns</FeatureTitle>
              <FeatureDescription>7 days return policy</FeatureDescription>
            </FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <FaHeadset />
            </FeatureIcon>
            <FeatureText>
              <FeatureTitle>24/7 Support</FeatureTitle>
              <FeatureDescription>Dedicated support</FeatureDescription>
            </FeatureText>
          </FeatureItem>
        </FeaturesStrip>

        <CategoriesSection>
          <SectionHeader>
            <SectionTitle>Browse Categories</SectionTitle>
            <ViewAllLink to="/categories">View All Categories <FaArrowRight /></ViewAllLink>
          </SectionHeader>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryItem key={category.id}>
                <Link to={`/category/${category.slug}`}>
                  <CategoryImage>
                    {category.image ? (
                      <img src={category.image} alt={category.name} />
                    ) : (
                      <CategoryPlaceholder>{category.name.charAt(0)}</CategoryPlaceholder>
                    )}
                  </CategoryImage>
                  <CategoryName>{category.name}</CategoryName>
                </Link>
              </CategoryItem>
            ))}
          </CategoryGrid>
        </CategoriesSection>
        
        <NewArrivalsSection>
          <SectionHeader>
            <SectionTitle>New Arrivals</SectionTitle>
            <ViewAllLink to="/new-arrivals">View All <FaArrowRight /></ViewAllLink>
          </SectionHeader>
          <ProductGrid>
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </NewArrivalsSection>

        <BannerSection>
          <Banner>
            <BannerContent>
              <BannerTitle>Special Offers</BannerTitle>
              <BannerText>Discover amazing deals with up to 50% off!</BannerText>
              <BannerButton to="/category/deals">Shop Now</BannerButton>
            </BannerContent>
          </Banner>
        </BannerSection>

        <FeaturedSection>
          <SectionHeader>
            <SectionTitle>Featured Products</SectionTitle>
            <ViewAllLink to="/featured">View All <FaArrowRight /></ViewAllLink>
          </SectionHeader>
          <ProductGrid>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </FeaturedSection>
        
        <DealsSection>
          <SectionHeader>
            <SectionTitle>Hot Deals</SectionTitle>
            <ViewAllLink to="/deals">View All Deals <FaArrowRight /></ViewAllLink>
          </SectionHeader>
          <DealsGrid>
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </DealsGrid>
        </DealsSection>
        
        {categories.map((category) => (
          categorizedProducts[category.id] && categorizedProducts[category.id].length > 0 && (
            <CategorySection key={category.id}>
              <SectionHeader>
                <SectionTitle>{category.name}</SectionTitle>
                <ViewAllLink to={`/category/${category.slug}`}>View All <FaArrowRight /></ViewAllLink>
              </SectionHeader>
              <ProductGrid>
                {categorizedProducts[category.id].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>
            </CategorySection>
          )
        ))}
        
        <SubscribeSection>
          <SubscribeContainer>
            <SubscribeContent>
              <SubscribeTitle>Subscribe to Our Newsletter</SubscribeTitle>
              <SubscribeText>Get exclusive offers, updates and news</SubscribeText>
              <SubscribeForm>
                <SubscribeInput type="email" placeholder="Your email address" />
                <SubscribeButton>Subscribe</SubscribeButton>
              </SubscribeForm>
            </SubscribeContent>
          </SubscribeContainer>
        </SubscribeSection>
      </Container>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

const HeroSection = styled.section`
  margin-bottom: 30px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: ${props => props.theme.colors.primary};
    margin-top: 8px;
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease;
  
  svg {
    font-size: 12px;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    svg {
      transform: translateX(3px);
    }
  }
`;

const FeaturesStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => `${props.theme.colors.primary}10`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
`;

const FeatureText = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const FeatureDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.lightText};
  margin: 0;
`;

const CategoriesSection = styled.section`
  margin-bottom: 40px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryItem = styled.div`
  text-align: center;
  
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CategoryImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  background-color: ${props => props.theme.colors.mediumGray};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  background-color: ${props => props.theme.colors.lightGray};
`;

const CategoryName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const FeaturedSection = styled.section`
  margin-bottom: 40px;
`;

const NewArrivalsSection = styled.section`
  margin-bottom: 40px;
`;

const CategorySection = styled.section`
  margin-bottom: 40px;
`;

const DealsSection = styled.section`
  margin-bottom: 40px;
`;

const DealsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    grid-template-columns: 1fr;
  }
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
  
  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    grid-template-columns: 1fr;
  }
`;

const BannerSection = styled.section`
  margin-bottom: 40px;
`;

const Banner = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const BannerContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 20px;
  }
`;

const BannerTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 10px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const BannerText = styled.p`
  font-size: 18px;
  color: white;
  margin: 0 0 20px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const BannerButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: white;
  color: ${props => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 4px;
  max-width: fit-content;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
    color: white;
    transform: translateY(-2px);
  }
`;

const SubscribeSection = styled.section`
  margin: 60px 0;
`;

const SubscribeContainer = styled.div`
  background-color: ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 30px 20px;
  }
`;

const SubscribeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SubscribeTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 10px 0;
`;

const SubscribeText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 25px 0;
`;

const SubscribeForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 500px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SubscribeInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 20px;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    border-radius: 4px;
  }
`;

const SubscribeButton = styled.button`
  height: 48px;
  padding: 0 25px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => `${props.theme.colors.accent}dd`};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    border-radius: 4px;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${props => props.theme.colors.error};
  font-size: 18px;
`;

export default HomePage; 