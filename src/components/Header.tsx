import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaSearch, FaBars } from 'react-icons/fa';
import { getAllCategories } from '../services/categoryService';
import { Category } from '../types/category';
import theme from '../theme';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Focus the search input when expanded
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    // Check if we're on mobile based on window width
    const mobileBreakpoint = 768; // This matches the 'sm' breakpoint in theme
    const isMobile = window.innerWidth <= mobileBreakpoint;
    
    if (isMobile) {
      // On mobile, open the mobile menu directly
      setIsMobileMenuOpen(true);
    } else {
      // On desktop, toggle the search expansion
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Only collapse if clicking outside the search components
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsSearchExpanded(false);
    }
  };

  const handleSearchToggleOnMobile = () => {
    if (window.innerWidth <= parseInt(theme.breakpoints.sm.replace('px', ''))) {
      // On mobile, open the mobile menu with focus on the search instead
      setIsMobileMenuOpen(true);
      // We'll focus the search input in the mobile menu after it renders
      setTimeout(() => {
        const mobileSearchInput = document.querySelector('#mobile-search-input') as HTMLInputElement;
        if (mobileSearchInput) {
          mobileSearchInput.focus();
        }
      }, 100);
    } else {
      // On larger screens, use the original toggle behavior
      toggleSearch();
    }
  };

  return (
    <HeaderContainer>
      {/* Headline Banner */}
      <AnnouncementBar>
        <ScrollWrapper>
          <MarqueeText>
            🔥 Hot Deals! Up to 70% OFF on Electronics! 🛍️ Affiliated Store - Get Discounts on New Arrivals! 📱 Download our App for Exclusive Offers!
          </MarqueeText>
          <MarqueeText>
          🔥 Hot Deals! Up to 70% OFF on Electronics! 🛍️ Affiliated Store - Get Discounts on New Arrivals! 📱 Download our App for Exclusive Offers!
          </MarqueeText>
          <MarqueeText>
          🔥 Hot Deals! Up to 70% OFF on Electronics! 🛍️ Affiliated Store - Get Discounts on New Arrivals! 📱 Download our App for Exclusive Offers!
          </MarqueeText>
        </ScrollWrapper>
      </AnnouncementBar>
      
      <MainHeader>
        <Container>
          <HeaderContent>
            <MobileMenuButton onClick={toggleMobileMenu}>
              <FaBars />
            </MobileMenuButton>
            
            <LeftSection>
              <LogoContainer>
                <Link to="/">
                  <LogoImage src="/daraz-logo-removebg-preview.png" alt="Daraz Deals" />
                </Link>
              </LogoContainer>
            </LeftSection>
            
            <CenterSection>
              <SiteName as={Link} to="/">Daraz Deals</SiteName>
            </CenterSection>
            
            <RightSection>
              <SearchContainer 
                expanded={isSearchExpanded}
                onBlur={handleSearchBlur}
                tabIndex={0} // Make div focusable for blur event
              >
                {!isSearchExpanded ? (
                  <SearchToggle onClick={handleSearchToggleOnMobile}>
                    <FaSearch />
                  </SearchToggle>
                ) : (
                  <SearchBar onSubmit={handleSearch}>
                    <SearchInput 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search in Daraz Deals" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SearchButton type="submit">
                      <FaSearch />
                    </SearchButton>
                    <CloseSearchButton type="button" onClick={toggleSearch}>×</CloseSearchButton>
                  </SearchBar>
                )}
              </SearchContainer>
            </RightSection>
          </HeaderContent>
        </Container>
      </MainHeader>
      
      <NavigationBar>
        <Container>
          <CategoryMenu>
            <CategoryItem>
              <AllCategoriesLink as={Link} to="/categories">
                <FaBars style={{ marginRight: '8px' }} /> All Categories
              </AllCategoriesLink>
              <CategoriesDropdown>
                {categories.map((category) => (
                  <DropdownItem key={category.id}>
                    <Link to={`/category/${category.slug}`}>{category.name}</Link>
                  </DropdownItem>
                ))}
              </CategoriesDropdown>
            </CategoryItem>
            {categories.slice(0, 6).map((category) => (
              <CategoryItem key={category.id}>
                <Link to={`/category/${category.slug}`}>{category.name}</Link>
              </CategoryItem>
            ))}
            <CategoryItem>
              <Link to="/category/deals">
                <FlashSaleLink>Flash Sale</FlashSaleLink>
              </Link>
            </CategoryItem>
          </CategoryMenu>
        </Container>
      </NavigationBar>
      
      {isMobileMenuOpen && (
        <MobileMenu>
          <MobileMenuHeader>
            <LogoImage src="/daraz-logo-removebg-preview.png" alt="Daraz Deals" style={{ height: '30px' }} />
            <CloseButton onClick={toggleMobileMenu}>×</CloseButton>
          </MobileMenuHeader>
          <MobileMenuSearch onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              setIsMobileMenuOpen(false);
            }
          }}>
            <SearchInput 
              id="mobile-search-input"
              type="text" 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </MobileMenuSearch>
          <MobileCategories>
            <MobileMenuTitle>Categories</MobileMenuTitle>
            <li>
              <Link 
                to="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <strong>All Categories</strong>
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  to={`/category/${category.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                to="/category/deals"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FlashSaleLink style={{ fontSize: '14px' }}>Flash Sale</FlashSaleLink>
              </Link>
            </li>
            <MobileMenuTitle style={{ marginTop: '20px' }}>Quick Links</MobileMenuTitle>
            <li>
              <Link 
                to="/help-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Customer Support
              </Link>
            </li>
            <li>
              <Link 
                to="/about-us"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
          </MobileCategories>
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
`;

const AnnouncementBar = styled.div`
  background-color: #ee4d2d; /* Red background */
  color: white;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 0;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const ticker = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-33.333%, 0, 0); }
`;

const ScrollWrapper = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ${ticker} 30s linear infinite;
  width: fit-content;
`;

const MarqueeText = styled.div`
  display: inline-block;
  white-space: nowrap;
  padding-right: 50px;
  flex-shrink: 0;
  min-width: 33.333%;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

const MainHeader = styled.div`
  padding: 15px 0;
  background-color: ${props => props.theme.colors.white};
  position: relative;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative; /* Add position relative to contain the absolute positioned hamburger */
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
    row-gap: 15px;
    justify-content: center;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    order: 1;
    width: auto;
    margin-right: 10px;
    padding-left: 40px; /* Make space for the hamburger icon */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding-left: 50px; /* Make space for the hamburger icon */
  }
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    justify-content: center;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 0;
    width: auto;
    justify-content: center;
    order: 2;
    flex: 0;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    order: 3;
    width: auto;
    justify-content: flex-end;
    position: absolute;
    right: 20px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: auto;
  }
`;

const SiteName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  letter-spacing: 1px;
  font-family: 'Poppins', 'Segoe UI', 'Roboto', sans-serif;
  text-transform: uppercase;
  margin: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 24px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 20px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 18px;
  }
`;

const LogoContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    height: 40px;
  }
`;

const SearchContainer = styled.div<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  width: ${props => props.expanded ? '250px' : 'auto'};
  transition: width 0.3s ease;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none; /* Hide search completely on mobile/tablet */
  }
`;

const SearchToggle = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SearchBar = styled.form`
  display: flex;
  width: 100%;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 60px 8px 15px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  outline: none;
  font-size: 14px;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 16px;
  cursor: pointer;
`;

const CloseSearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NavigationBar = styled.nav`
  background-color: white;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const CategoryMenu = styled.ul`
  display: flex;
  gap: 25px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const pulse = keyframes`
  0% { color: ${props => props.theme.colors.primary}; }
  50% { color: ${props => props.theme.colors.secondary}; }
  100% { color: ${props => props.theme.colors.primary}; }
`;

const FlashSaleLink = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
  animation: ${pulse} 2s infinite;
`;

const CategoryItem = styled.li`
  white-space: nowrap;
  font-weight: 500;
  position: relative;
  padding: 5px 0;
  
  a {
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const AllCategoriesLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CategoriesDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  width: 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px 0;
  z-index: 10;
  display: none;
  
  ${CategoryItem}:hover & {
    display: block;
  }
`;

const DropdownItem = styled.div`
  padding: 8px 15px;
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CloseButton = styled.button`
  font-size: 24px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const MobileMenuSearch = styled.form`
  display: flex;
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: relative;
  
  input {
    flex: 1;
    width: 100%;
    padding: 12px 40px 12px 15px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  button {
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${props => props.theme.colors.primary};
    font-size: 16px;
    cursor: pointer;
    padding: 0;
  }
`;

const MobileMenuTitle = styled.h3`
  font-size: 16px;
  margin: 15px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const MobileCategories = styled.ul`
  padding: 0 15px;
  margin: 0;
  list-style: none;
  flex: 1;
  overflow-y: auto;
  
  li {
    padding: 12px 0;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    
    a {
      display: block;
      font-weight: 500;
    }
  }
`;

const MainHeaderContainer = styled(Container)`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding-left: calc(${props => props.theme.spacing.md} + 30px); /* Add extra padding for hamburger menu */
  }
`;

export default Header; 