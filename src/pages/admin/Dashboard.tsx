import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { formatPrice } from '../../utils/format';
import Spinner from '../../components/Spinner';
import {
  FaBox,
  FaTags,
  FaMoneyBillWave,
  FaStar,
  FaExclamationTriangle,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaChartArea
} from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Statistics
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalInventoryValue: 0,
    averageRating: 0,
    lowStockProducts: 0,
    averagePrice: 0,
    categoryDistribution: {} as Record<string, number>,
    topRatedProducts: [] as Product[],
    recentlyAdded: [] as Product[]
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);

        setProducts(fetchedProducts);
        setCategories(fetchedCategories);

        // Calculate statistics
        const totalProducts = fetchedProducts.length;
        const totalCategories = fetchedCategories.length;
        
        // Total inventory value (sum of price * stock)
        const totalInventoryValue = fetchedProducts.reduce(
          (sum, product) => sum + (product.price * product.stockQuantity), 
          0
        );
        
        // Average rating
        const averageRating = fetchedProducts.length > 0 
          ? fetchedProducts.reduce((sum, product) => sum + product.rating, 0) / totalProducts 
          : 0;
        
        // Low stock products (less than 10 units)
        const lowStockProducts = fetchedProducts.filter(
          product => product.stockQuantity < 10
        ).length;
        
        // Average price
        const averagePrice = fetchedProducts.length > 0 
          ? fetchedProducts.reduce((sum, product) => sum + product.price, 0) / totalProducts 
          : 0;
        
        // Category distribution
        const categoryDistribution: Record<string, number> = {};
        fetchedProducts.forEach(product => {
          const categoryId = product.categoryId;
          categoryDistribution[categoryId] = (categoryDistribution[categoryId] || 0) + 1;
        });
        
        // Top rated products (5 highest rated)
        const topRatedProducts = [...fetchedProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        
        // Recently added products (5 most recent)
        const recentlyAdded = [...fetchedProducts]
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);
        
        setStats({
          totalProducts,
          totalCategories,
          totalInventoryValue,
          averageRating,
          lowStockProducts,
          averagePrice,
          categoryDistribution,
          topRatedProducts,
          recentlyAdded
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spinner size="large" text="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  // Helper to get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
        <PeriodSelector>
          <PeriodButton 
            active={activePeriod === 'day'} 
            onClick={() => setActivePeriod('day')}
          >
            Day
          </PeriodButton>
          <PeriodButton 
            active={activePeriod === 'week'} 
            onClick={() => setActivePeriod('week')}
          >
            Week
          </PeriodButton>
          <PeriodButton 
            active={activePeriod === 'month'} 
            onClick={() => setActivePeriod('month')}
          >
            Month
          </PeriodButton>
          <PeriodButton 
            active={activePeriod === 'year'} 
            onClick={() => setActivePeriod('year')}
          >
            Year
          </PeriodButton>
        </PeriodSelector>
      </DashboardHeader>

      <StatsGrid>
        <StatCard primary>
          <StatIconContainer primary>
            <FaBox />
          </StatIconContainer>
          <StatContent>
            <StatValue>{stats.totalProducts}</StatValue>
            <StatLabel>Total Products</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard secondary>
          <StatIconContainer secondary>
            <FaTags />
          </StatIconContainer>
          <StatContent>
            <StatValue>{stats.totalCategories}</StatValue>
            <StatLabel>Categories</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard accent>
          <StatIconContainer accent>
            <FaMoneyBillWave />
          </StatIconContainer>
          <StatContent>
            <StatValue>{formatPrice(stats.totalInventoryValue)}</StatValue>
            <StatLabel>Total Inventory Value</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIconContainer>
            <FaStar />
          </StatIconContainer>
          <StatContent>
            <StatValue>{stats.averageRating.toFixed(1)}</StatValue>
            <StatLabel>Average Rating</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <DashboardGrid>
        <DashboardSection>
          <SectionHeader>
            <SectionTitle>Top Rated Products</SectionTitle>
            <ViewAllLink to="/admin/products">View All</ViewAllLink>
          </SectionHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topRatedProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link to={`/admin/products/${product.id}`}>{product.name}</Link>
                  </TableCell>
                  <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <RatingCell>
                      <FaStar color="#FFD700" />
                      <span>{product.rating.toFixed(1)}</span>
                    </RatingCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardSection>

        <DashboardSection>
          <SectionHeader>
            <SectionTitle>Low Stock Products</SectionTitle>
            <WarningBadge>
              <FaExclamationTriangle />
              <span>{stats.lowStockProducts}</span>
            </WarningBadge>
          </SectionHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Stock</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                .filter(product => product.stockQuantity < 10)
                .slice(0, 5)
                .map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link to={`/admin/products/${product.id}`}>{product.name}</Link>
                    </TableCell>
                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell>
                      <StockStatus low={product.stockQuantity < 5}>
                        {product.stockQuantity === 0 
                          ? 'Out of Stock' 
                          : product.stockQuantity < 5 
                            ? 'Critical' 
                            : 'Low'}
                      </StockStatus>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DashboardSection>

        <DashboardSection>
          <SectionHeader>
            <SectionTitle>Categories Overview</SectionTitle>
          </SectionHeader>
          <CategoryGrid>
            {categories.slice(0, 6).map(category => {
              const productCount = stats.categoryDistribution[category.id] || 0;
              const percentage = stats.totalProducts > 0 
                ? (productCount / stats.totalProducts) * 100 
                : 0;
              
              return (
                <CategoryCard key={category.id}>
                  <CategoryInfo>
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryCount>{productCount} products</CategoryCount>
                  </CategoryInfo>
                  <ProgressBar>
                    <Progress width={percentage} />
                  </ProgressBar>
                  <PercentageValue>{percentage.toFixed(1)}%</PercentageValue>
                </CategoryCard>
              );
            })}
          </CategoryGrid>
        </DashboardSection>

        <DashboardSection>
          <SectionHeader>
            <SectionTitle>Recently Added Products</SectionTitle>
            <ViewAllLink to="/admin/products">View All</ViewAllLink>
          </SectionHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Date Added</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentlyAdded.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link to={`/admin/products/${product.id}`}>{product.name}</Link>
                  </TableCell>
                  <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardSection>

        <DashboardSection fullWidth>
          <SectionHeader>
            <SectionTitle>Stats Overview</SectionTitle>
          </SectionHeader>
          <StatsCardGrid>
            <StatsCard>
              <StatsCardHeader>
                <StatsCardTitle>Sales</StatsCardTitle>
                <StatsCardIcon>
                  <FaChartLine />
                </StatsCardIcon>
              </StatsCardHeader>
              <StatsCardValue>+24.5%</StatsCardValue>
              <StatsCardDescription>
                Increase compared to previous {activePeriod}
              </StatsCardDescription>
            </StatsCard>
            
            <StatsCard>
              <StatsCardHeader>
                <StatsCardTitle>Revenue</StatsCardTitle>
                <StatsCardIcon>
                  <FaChartBar />
                </StatsCardIcon>
              </StatsCardHeader>
              <StatsCardValue>{formatPrice(stats.totalInventoryValue * 0.3)}</StatsCardValue>
              <StatsCardDescription>
                Total for this {activePeriod}
              </StatsCardDescription>
            </StatsCard>
            
            <StatsCard>
              <StatsCardHeader>
                <StatsCardTitle>Average Order</StatsCardTitle>
                <StatsCardIcon>
                  <FaChartPie />
                </StatsCardIcon>
              </StatsCardHeader>
              <StatsCardValue>{formatPrice(stats.averagePrice * 2.5)}</StatsCardValue>
              <StatsCardDescription>
                For this {activePeriod}
              </StatsCardDescription>
            </StatsCard>
            
            <StatsCard>
              <StatsCardHeader>
                <StatsCardTitle>Conversion</StatsCardTitle>
                <StatsCardIcon>
                  <FaChartArea />
                </StatsCardIcon>
              </StatsCardHeader>
              <StatsCardValue>3.2%</StatsCardValue>
              <StatsCardDescription>
                Site visitors to customers
              </StatsCardDescription>
            </StatsCard>
          </StatsCardGrid>
        </DashboardSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
  min-height: calc(100vh - 64px);
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PeriodSelector = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.mediumGray};
  border-radius: 8px;
  overflow: hidden;
`;

const PeriodButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.lightGray};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div<{ primary?: boolean; secondary?: boolean; accent?: boolean }>`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  ${props => props.primary && `
    border-left: 4px solid ${props.theme.colors.primary};
  `}
  
  ${props => props.secondary && `
    border-left: 4px solid ${props.theme.colors.secondary};
  `}
  
  ${props => props.accent && `
    border-left: 4px solid ${props.theme.colors.accent};
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatIconContainer = styled.div<{ primary?: boolean; secondary?: boolean; accent?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  
  ${props => props.primary && `
    background-color: ${props.theme.colors.primary}20;
    color: ${props.theme.colors.primary};
  `}
  
  ${props => props.secondary && `
    background-color: ${props.theme.colors.secondary}20;
    color: ${props.theme.colors.secondary};
  `}
  
  ${props => props.accent && `
    background-color: ${props.theme.colors.accent}20;
    color: ${props.theme.colors.accent};
  `}
  
  ${props => !props.primary && !props.secondary && !props.accent && `
    background-color: ${props.theme.colors.mediumGray};
    color: ${props.theme.colors.text};
  `}
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const DashboardSection = styled.div<{ fullWidth?: boolean }>`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ViewAllLink = styled(Link)`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  border-bottom: 1px solid ${props => props.theme.colors.mediumGray};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: 12px 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.lightText};
`;

const TableCell = styled.td`
  padding: 12px 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RatingCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 14px;
  }
`;

const WarningBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: ${props => `${props.theme.colors.error}20`};
  color: ${props => props.theme.colors.error};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  
  svg {
    font-size: 12px;
  }
`;

const StockStatus = styled.div<{ low: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => props.low 
    ? `
      background-color: ${props.theme.colors.error}20;
      color: ${props.theme.colors.error};
    `
    : `
      background-color: ${props.theme.colors.warning}20;
      color: ${props.theme.colors.warning};
    `
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.xs}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 6px;
`;

const CategoryInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CategoryName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const CategoryCount = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.lightText};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const Progress = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => `${props.width}%`};
  background-color: ${props => props.theme.colors.primary};
  border-radius: 4px;
`;

const PercentageValue = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.lightText};
  text-align: right;
`;

const StatsCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
`;

const StatsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatsCardTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.lightText};
`;

const StatsCardIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsCardValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const StatsCardDescription = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.lightText};
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.error};
  font-size: 16px;
`;

export default Dashboard; 