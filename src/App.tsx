import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalStyle from './components/GlobalStyle';
import theme from './theme';

// Public pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import NotFound from './pages/NotFound';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import FlashDeals from './pages/FlashDeals';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Reviews from './pages/admin/Reviews';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <>
                <Header />
                <main>
                  <HomePage />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/product/:slug" 
            element={
              <>
                <Header />
                <main>
                  <ProductPage />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <>
                <Header />
                <main>
                  <CategoriesPage />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/category/:slug" 
            element={
              <>
                <Header />
                <main>
                  <CategoryPage />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/category/deals" 
            element={
              <>
                <Header />
                <main>
                  <FlashDeals />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/help-center" 
            element={
              <>
                <Header />
                <main>
                  <HelpCenter />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/contact-us" 
            element={
              <>
                <Header />
                <main>
                  <ContactUs />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/about-us" 
            element={
              <>
                <Header />
                <main>
                  <AboutUs />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/terms-conditions" 
            element={
              <>
                <Header />
                <main>
                  <TermsConditions />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/privacy-policy" 
            element={
              <>
                <Header />
                <main>
                  <PrivacyPolicy />
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="*" 
            element={
              <>
                <Header />
                <main>
                  <NotFound />
                </main>
                <Footer />
              </>
            } 
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 