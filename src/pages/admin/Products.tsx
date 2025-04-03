import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSortAmountDown, FaSortAmountUp, FaEye } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { getAllProducts, deleteProduct } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { formatPrice } from '../../utils/format';
import ProductForm from '../../components/admin/ProductForm';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<'title' | 'price' | 'stockQuantity'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getAllProducts();
      const fetchedCategories = await getAllCategories();
      
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.title}?`)) {
      setIsDeleting(true);
      try {
        await deleteProduct(product.id);
        setProducts(products.filter(p => p.id !== product.id));
        showSuccess(`${product.title} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = () => {
    fetchData();
    setShowForm(false);
    setEditingProduct(null);
    showSuccess(editingProduct ? 'Product updated successfully!' : 'New product added successfully!');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSort = (field: 'title' | 'price' | 'stockQuantity') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortField === 'price') {
      const aPrice = a.discountPrice || a.price;
      const bPrice = b.discountPrice || b.price;
      return sortDirection === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    } else if (sortField === 'stockQuantity') {
      return sortDirection === 'asc' ? a.stockQuantity - b.stockQuantity : b.stockQuantity - a.stockQuantity;
    }
    return 0;
  });

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <AdminLayout>
      <ProductsContainer>
        <Header>
          <HeaderTitle>Product Management</HeaderTitle>
          <AddButton onClick={handleAddProduct} data-testid="add-product-button">
            <FaPlus /> Add New Product
          </AddButton>
        </Header>

        {successMessage && (
          <SuccessMessage>
            {successMessage}
          </SuccessMessage>
        )}
        
        <FiltersContainer>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>
          
          <CategorySelect onChange={handleCategoryFilter} value={categoryFilter}>
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </CategorySelect>
        </FiltersContainer>

        <SummaryStats>
          <StatCard>
            <StatTitle>Total Products</StatTitle>
            <StatValue>{products.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Active Categories</StatTitle>
            <StatValue>{categories.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Low Stock Products</StatTitle>
            <StatValue>{products.filter(p => p.stockQuantity <= 10).length}</StatValue>
          </StatCard>
        </SummaryStats>
        
        {isLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : (
          <>
            {sortedProducts.length > 0 ? (
              <ProductTable>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th onClick={() => handleSort('title')} className="sortable">
                      Title {sortField === 'title' && (
                        sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                      )}
                    </th>
                    <th>Category</th>
                    <th onClick={() => handleSort('price')} className="sortable">
                      Price {sortField === 'price' && (
                        sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                      )}
                    </th>
                    <th onClick={() => handleSort('stockQuantity')} className="sortable">
                      Stock {sortField === 'stockQuantity' && (
                        sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <ProductImage>
                          <img 
                            src={product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/50'} 
                            alt={product.title} 
                          />
                        </ProductImage>
                      </td>
                      <td>
                        <ProductTitle>{product.title}</ProductTitle>
                        <ProductBrand>{product.brand}</ProductBrand>
                      </td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td>
                        {product.discountPrice ? (
                          <PriceContainer>
                            <DiscountPrice>{formatPrice(product.discountPrice)}</DiscountPrice>
                            <OriginalPrice>{formatPrice(product.price)}</OriginalPrice>
                          </PriceContainer>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </td>
                      <td>
                        <StockIndicator low={product.stockQuantity <= 10}>
                          {product.stockQuantity}
                        </StockIndicator>
                      </td>
                      <td>
                        <ActionButtons>
                          <ActionButton as={Link} to={`/product/${product.slug}`} title="View Product" target="_blank">
                            <FaEye />
                          </ActionButton>
                          <ActionButton onClick={() => handleEditProduct(product)} title="Edit Product">
                            <FaEdit />
                          </ActionButton>
                          <ActionButton 
                            onClick={() => handleDeleteProduct(product)}
                            disabled={isDeleting}
                            title="Delete Product"
                          >
                            <FaTrash />
                          </ActionButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProductTable>
            ) : (
              <EmptyMessage>
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No products match your search criteria.' 
                  : 'No products added yet. Click "Add New Product" to get started.'}
              </EmptyMessage>
            )}
          </>
        )}
        
        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </ProductsContainer>
    </AdminLayout>
  );
};

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.lightText};
  font-size: 14px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CategorySelect = styled.select`
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  th, td {
    padding: 15px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    font-weight: 600;
    color: ${props => props.theme.colors.lightText};
    background-color: #f9f9f9;
    
    &.sortable {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &:hover {
        background-color: #f0f0f0;
      }
      
      svg {
        font-size: 12px;
      }
    }
  }
  
  tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    overflow-x: auto;
  }
`;

const ProductImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ProductBrand = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.darkGray};
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DiscountPrice = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-size: 12px;
  text-decoration: line-through;
  color: ${props => props.theme.colors.darkGray};
`;

const StockIndicator = styled.div<{ low: boolean }>`
  color: ${props => props.low ? props.theme.colors.error : 'inherit'};
  font-weight: ${props => props.low ? '600' : 'normal'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:nth-child(1) {
    color: ${props => props.theme.colors.secondary};
    
    &:hover {
      background-color: ${props => props.theme.colors.secondary};
      color: white;
      border-color: ${props => props.theme.colors.secondary};
    }
  }
  
  &:nth-child(3) {
    color: ${props => props.theme.colors.error};
    
    &:hover {
      background-color: ${props => props.theme.colors.error};
      color: white;
      border-color: ${props => props.theme.colors.error};
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  color: ${props => props.theme.colors.lightText};
  font-size: 16px;
`;

export default Products; 