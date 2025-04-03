import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronDown, FaFilter, FaStar, FaSort } from 'react-icons/fa';
import { getProductsByCategory } from '../services/productService';
import { getCategoryBySlug } from '../services/categoryService';
import { Product } from '../types/product';
import { Category } from '../types/category';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const ITEMS_PER_PAGE = 12;

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [isRatingFilterOpen, setIsRatingFilterOpen] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        // Fetch category
        const fetchedCategory = await getCategoryBySlug(slug);
        
        if (!fetchedCategory) {
          setError('Category not found');
          return;
        }
        
        setCategory(fetchedCategory);
        
        // Fetch products for this category
        const { products: fetchedProducts, lastVisible: lastDoc } = 
          await getProductsByCategory(fetchedCategory.id, ITEMS_PER_PAGE);
        
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLastVisible(lastDoc);
        setHasMore(fetchedProducts.length === ITEMS_PER_PAGE);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching category and products:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  useEffect(() => {
    // Apply filters and sorting
    if (products.length > 0) {
      let filtered = [...products];
      
      // Filter by price
      filtered = filtered.filter(product => {
        const price = product.discountPrice || product.price;
        return price >= priceRange[0] && price <= priceRange[1];
      });
      
      // Filter by rating
      if (ratingFilter > 0) {
        filtered = filtered.filter(product => product.rating >= ratingFilter);
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price_desc':
          filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case 'rating_desc':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        default:
          break;
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, priceRange, ratingFilter, sortBy]);

  const loadMoreProducts = async () => {
    if (!category || !lastVisible || loadingMore) return;
    
    setLoadingMore(true);
    
    try {
      const { products: moreProducts, lastVisible: lastDoc } = 
        await getProductsByCategory(category.id, ITEMS_PER_PAGE, lastVisible);
      
      setProducts(prev => [...prev, ...moreProducts]);
      setLastVisible(lastDoc);
      setHasMore(moreProducts.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const togglePriceFilter = () => {
    setIsPriceFilterOpen(!isPriceFilterOpen);
  };

  const toggleRatingFilter = () => {
    setIsRatingFilterOpen(!isRatingFilterOpen);
  };

  const toggleSorting = () => {
    setIsSortingOpen(!isSortingOpen);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleRatingChange = (rating: number) => {
    setRatingFilter(rating);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsSortingOpen(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !category) {
    return <ErrorMessage>{error || 'Category not found'}</ErrorMessage>;
  }

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/')}>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItemActive>{category.name}</BreadcrumbItemActive>
      </Breadcrumb>

      <CategoryHeader>
        <CategoryTitle>{category.name}</CategoryTitle>
        {category.description && <CategoryDescription>{category.description}</CategoryDescription>}
      </CategoryHeader>

      <MobileFilterButton onClick={toggleFilters}>
        <FaFilter /> Filter & Sort
      </MobileFilterButton>

      <Content>
        <FiltersContainer show={showFilters}>
          <FilterHeader>
            <FilterTitle>Filters</FilterTitle>
            <CloseFiltersButton onClick={toggleFilters}>&times;</CloseFiltersButton>
          </FilterHeader>
          
          <FilterSection>
            <FilterSectionHeader onClick={togglePriceFilter}>
              <FilterSectionTitle>Price Range</FilterSectionTitle>
              <FilterIcon rotated={isPriceFilterOpen}><FaChevronDown /></FilterIcon>
            </FilterSectionHeader>
            
            {isPriceFilterOpen && (
              <PriceFilterContent>
                <PriceInput>
                  <span>Min:</span>
                  <input 
                    type="number" 
                    value={priceRange[0]} 
                    onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, priceRange[1])} 
                  />
                </PriceInput>
                <PriceInput>
                  <span>Max:</span>
                  <input 
                    type="number" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) || 0)} 
                  />
                </PriceInput>
                <PriceSlider>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                  />
                </PriceSlider>
                <PriceRangeLabels>
                  <span>{priceRange[0] === 0 ? '0' : priceRange[0]}</span>
                  <span>{priceRange[1] === 100000 ? '100,000' : priceRange[1]}</span>
                </PriceRangeLabels>
              </PriceFilterContent>
            )}
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={toggleRatingFilter}>
              <FilterSectionTitle>Rating</FilterSectionTitle>
              <FilterIcon rotated={isRatingFilterOpen}><FaChevronDown /></FilterIcon>
            </FilterSectionHeader>
            
            {isRatingFilterOpen && (
              <RatingFilterContent>
                {[4, 3, 2, 1].map(rating => (
                  <RatingOption 
                    key={rating} 
                    onClick={() => handleRatingChange(rating)}
                    selected={ratingFilter === rating}
                  >
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        color={i < rating ? '#ffc907' : '#e0e0e0'} 
                        size={14}
                      />
                    ))}
                    <span>& Up</span>
                  </RatingOption>
                ))}
                <RatingOption 
                  onClick={() => handleRatingChange(0)}
                  selected={ratingFilter === 0}
                >
                  Show All
                </RatingOption>
              </RatingFilterContent>
            )}
          </FilterSection>
          
          <FilterSection>
            <FilterSectionHeader onClick={toggleSorting}>
              <FilterSectionTitle>Sort By</FilterSectionTitle>
              <FilterIcon rotated={isSortingOpen}><FaChevronDown /></FilterIcon>
            </FilterSectionHeader>
            
            {isSortingOpen && (
              <SortingOptions>
                <SortOption 
                  selected={sortBy === 'price_asc'} 
                  onClick={() => handleSortChange('price_asc')}
                >
                  Price: Low to High
                </SortOption>
                <SortOption 
                  selected={sortBy === 'price_desc'} 
                  onClick={() => handleSortChange('price_desc')}
                >
                  Price: High to Low
                </SortOption>
                <SortOption 
                  selected={sortBy === 'rating_desc'} 
                  onClick={() => handleSortChange('rating_desc')}
                >
                  Highest Rated
                </SortOption>
                <SortOption 
                  selected={sortBy === 'newest'} 
                  onClick={() => handleSortChange('newest')}
                >
                  Newest First
                </SortOption>
              </SortingOptions>
            )}
          </FilterSection>
        </FiltersContainer>

        <ProductsContainer>
          <ResultCount>{filteredProducts.length} products found</ResultCount>
          
          <SortingBar>
            <SortLabel><FaSort /> Sort By:</SortLabel>
            <SortSelect value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="newest">Newest First</option>
            </SortSelect>
          </SortingBar>
          
          {filteredProducts.length > 0 ? (
            <ProductGrid>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <NoProducts>No products match your filters. Try adjusting your criteria.</NoProducts>
          )}
          
          {hasMore && (
            <LoadMoreButton 
              onClick={loadMoreProducts} 
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More Products'}
            </LoadMoreButton>
          )}
        </ProductsContainer>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px ${props => props.theme.spacing.md};
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

const CategoryHeader = styled.div`
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const CategoryDescription = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
`;

const Content = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const FiltersContainer = styled.div<{ show: boolean }>`
  width: 280px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 0;
    overflow-y: auto;
    transform: ${props => props.show ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    button {
      display: none;
    }
  }
`;

const FilterTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const CloseFiltersButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 20px;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const FilterSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
`;

const FilterSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const FilterIcon = styled.span<{ rotated: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  transform: ${props => props.rotated ? 'rotate(180deg)' : 'rotate(0)'};
`;

const PriceFilterContent = styled.div`
  margin-top: 15px;
  padding: 0 5px;
`;

const PriceInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
  
  span {
    width: 40px;
    font-size: 14px;
    color: ${props => props.theme.colors.lightText};
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const PriceSlider = styled.div`
  position: relative;
  height: 40px;
  
  input[type="range"] {
    position: absolute;
    width: 100%;
    height: 5px;
    background: none;
    pointer-events: none;
    -webkit-appearance: none;
    
    &::-webkit-slider-thumb {
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: ${props => props.theme.colors.primary};
      cursor: pointer;
      pointer-events: auto;
      -webkit-appearance: none;
      margin-top: -6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    
    &::-moz-range-thumb {
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: ${props => props.theme.colors.primary};
      cursor: pointer;
      border: none;
      pointer-events: auto;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    
    &:focus {
      outline: none;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 5px;
    background: ${props => props.theme.colors.border};
    top: 50%;
    transform: translateY(-50%);
    border-radius: 5px;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: ${props => (props.children[0]?.props?.value / 100000) * 100}%;
    right: ${props => 100 - (props.children[1]?.props?.value / 100000) * 100}%;
    height: 5px;
    background: ${props => props.theme.colors.primary};
    top: 50%;
    transform: translateY(-50%);
    border-radius: 5px;
    z-index: -1;
  }
`;

const PriceRangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 13px;
  color: ${props => props.theme.colors.lightText};
`;

const RatingFilterContent = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RatingOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${props => props.selected ? props.theme.colors.lightGray : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
  
  span {
    font-size: 14px;
    margin-left: 5px;
  }
`;

const SortingOptions = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SortOption = styled.div<{ selected: boolean }>`
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${props => props.selected ? props.theme.colors.lightGray : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

const ProductsContainer = styled.div`
  flex: 1;
`;

const SortingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SortLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ResultCount = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: ${props => props.theme.colors.darkGray};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${props => props.theme.colors.lightText};
  font-size: 16px;
`;

const LoadMoreButton = styled.button`
  display: block;
  width: 200px;
  margin: 30px auto 0;
  padding: 12px 0;
  background-color: white;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 20px;
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${props => props.theme.colors.error};
  font-size: 18px;
`;

export default CategoryPage; 