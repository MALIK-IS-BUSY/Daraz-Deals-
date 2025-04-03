import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowRight, FaTag } from 'react-icons/fa';
import { getAllCategories } from '../services/categoryService';
import { Category } from '../types/category';
import Spinner from '../components/Spinner';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner size="large" />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/')}>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItemActive>All Categories</BreadcrumbItemActive>
      </Breadcrumb>

      <PageHeader>
        <PageTitle>All Categories</PageTitle>
        <PageDescription>Browse all product categories available on Daraz Deals</PageDescription>
      </PageHeader>

      <CategoriesGrid>
        {categories.map(category => (
          <CategoryCard key={category.id} to={`/category/${category.slug}`}>
            <CategoryIcon>
              <FaTag />
            </CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
            <CategoryDescription>
              {category.description ? 
                (category.description.length > 100 ? 
                  `${category.description.substring(0, 100)}...` : 
                  category.description) : 
                'Browse our selection of products in this category'}
            </CategoryDescription>
            <ViewCategory>
              View Category <FaArrowRight style={{ marginLeft: '5px' }} />
            </ViewCategory>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px ${props => props.theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${props => props.theme.colors.error};
  font-size: 18px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
`;

const BreadcrumbItem = styled.span`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbItemActive = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
  color: ${props => props.theme.colors.darkGray};
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const PageDescription = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.lightText};
  max-width: 600px;
  margin: 0 auto;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CategoryIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => `${props.theme.colors.primary}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
  font-size: 24px;
`;

const CategoryName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const CategoryDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
`;

const ViewCategory = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-top: auto;
`;

export default CategoriesPage; 