import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaListUl, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaComments
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Check on load
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <LayoutContainer>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <SidebarOverlay onClick={toggleSidebar} />
      )}
      
      <Sidebar open={isSidebarOpen}>
        <SidebarHeader>
          <Logo to="/">Daraz Deals</Logo>
          <CloseButton onClick={toggleSidebar}>
            <FaTimes />
          </CloseButton>
        </SidebarHeader>
        
        <AdminInfo>
          <AdminAvatar>
            <FaUser />
          </AdminAvatar>
          <AdminName>{currentUser?.email}</AdminName>
          <AdminRole>Administrator</AdminRole>
        </AdminInfo>
        
        <Navigation>
          <NavItem 
            active={isActive('/admin')} 
            onClick={() => {
              navigate('/admin');
              closeSidebarIfMobile();
            }}
          >
            <NavIcon>
              <FaTachometerAlt />
            </NavIcon>
            <NavText>Dashboard</NavText>
          </NavItem>
          
          <NavItem 
            active={isActive('/admin/products')} 
            onClick={() => {
              navigate('/admin/products');
              closeSidebarIfMobile();
            }}
          >
            <NavIcon>
              <FaBox />
            </NavIcon>
            <NavText>Products</NavText>
          </NavItem>
          
          <NavItem 
            active={isActive('/admin/categories')} 
            onClick={() => {
              navigate('/admin/categories');
              closeSidebarIfMobile();
            }}
          >
            <NavIcon>
              <FaListUl />
            </NavIcon>
            <NavText>Categories</NavText>
          </NavItem>
          
          <NavItem 
            active={isActive('/admin/reviews')} 
            onClick={() => {
              navigate('/admin/reviews');
              closeSidebarIfMobile();
            }}
          >
            <NavIcon>
              <FaComments />
            </NavIcon>
            <NavText>Reviews</NavText>
          </NavItem>
        </Navigation>
        
        <LogoutButton onClick={handleLogout}>
          <LogoutIcon>
            <FaSignOutAlt />
          </LogoutIcon>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>
      </Sidebar>
      
      <MainContent sidebarOpen={isSidebarOpen}>
        <Header>
          <MenuButton onClick={toggleSidebar}>
            <FaBars />
          </MenuButton>
          <PageTitle>
            {isActive('/admin') && 'Dashboard'}
            {isActive('/admin/products') && 'Products Management'}
            {isActive('/admin/categories') && 'Categories Management'}
            {isActive('/admin/reviews') && 'Reviews Management'}
          </PageTitle>
        </Header>
        
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.lightGray};
  position: relative;
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const Sidebar = styled.aside<{ open: boolean }>`
  width: 280px;
  background-color: ${props => props.theme.colors.text};
  color: white;
  transition: transform 0.3s ease;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    transform: ${props => props.open ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.open ? '2px 0 10px rgba(0, 0, 0, 0.2)' : 'none'};
    width: 250px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 85%;
    max-width: 280px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

const AdminInfo = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AdminAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
`;

const AdminName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  word-break: break-all;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const AdminRole = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 12px;
  }
`;

const Navigation = styled.nav`
  padding: 15px 0;
`;

const NavItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 12px 15px;
  }
`;

const NavIcon = styled.div`
  font-size: 18px;
  margin-right: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const NavText = styled.div`
  font-size: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 12px 15px;
  }
`;

const LogoutIcon = styled.div`
  font-size: 18px;
  margin-right: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const LogoutText = styled.div`
  font-size: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '280px' : '0'};
  transition: margin-left 0.3s ease;
  max-width: 100vw;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    margin-left: 0;
    width: 100%;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 12px 15px;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: none;
  margin-right: 15px;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 18px;
  }
`;

const ContentWrapper = styled.div`
  padding: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 20px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 15px;
  }
`;

export default AdminLayout; 