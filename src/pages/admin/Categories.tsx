import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { Category } from '../../types/category';
import { getAllCategories, deleteCategory } from '../../services/categoryService';
import CategoryForm from '../../components/admin/CategoryForm';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteCategory(category.id);
        setCategories(categories.filter(c => c.id !== category.id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = () => {
    fetchCategories();
    setShowForm(false);
    setEditingCategory(null);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <CategoriesContainer>
        <Header>
          <HeaderTitle>Category Management</HeaderTitle>
          <AddButton onClick={handleAddCategory}>
            <FaPlus /> Add New Category
          </AddButton>
        </Header>
        
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
        
        {isLoading ? (
          <Loading>Loading categories...</Loading>
        ) : (
          <>
            {filteredCategories.length > 0 ? (
              <CategoryGrid>
                {filteredCategories.map(category => (
                  <CategoryCard key={category.id}>
                    <CategoryImage>
                      {category.image ? (
                        <img src={category.image} alt={category.name} />
                      ) : (
                        <CategoryPlaceholder>{category.name.charAt(0)}</CategoryPlaceholder>
                      )}
                    </CategoryImage>
                    <CategoryContent>
                      <CategoryName>{category.name}</CategoryName>
                      <CategoryDescription>
                        {category.description || 'No description'}
                      </CategoryDescription>
                    </CategoryContent>
                    <CategoryActions>
                      <ActionButton onClick={() => handleEditCategory(category)}>
                        <FaEdit />
                      </ActionButton>
                      <ActionButton 
                        onClick={() => handleDeleteCategory(category)}
                        disabled={isDeleting}
                      >
                        <FaTrash />
                      </ActionButton>
                    </CategoryActions>
                  </CategoryCard>
                ))}
              </CategoryGrid>
            ) : (
              <EmptyMessage>
                {searchTerm 
                  ? 'No categories match your search.' 
                  : 'No categories added yet. Click "Add New Category" to get started.'}
              </EmptyMessage>
            )}
          </>
        )}
        
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </CategoriesContainer>
    </AdminLayout>
  );
};

const CategoriesContainer = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    justify-content: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.darkGray};
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

const Loading = styled.div`
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
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

const CategoryGrid = styled.div`
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

const CategoryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const CategoryImage = styled.div`
  height: 140px;
  background-color: ${props => props.theme.colors.lightGray};
  overflow: hidden;
  
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
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  background-color: ${props => props.theme.colors.lightGray};
`;

const CategoryContent = styled.div`
  padding: 15px;
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: ${props => props.theme.colors.text};
`;

const CategoryDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryActions = styled.div`
  display: flex;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  font-size: 16px;
  padding: 12px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  transition: background-color 0.3s ease;
  
  &:first-child {
    color: ${props => props.theme.colors.primary};
    border-right: 1px solid ${props => props.theme.colors.border};
    
    &:hover {
      background-color: rgba(52, 152, 219, 0.1);
    }
  }
  
  &:last-child {
    color: ${props => props.theme.colors.error};
    
    &:hover {
      background-color: rgba(231, 76, 60, 0.1);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Categories; 