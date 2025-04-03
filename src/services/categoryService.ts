import { Category } from '../types/category';
import { mockCategories } from './mockData';

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategories;
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const category = mockCategories.find(category => category.id === id);
  return category || null;
};

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const category = mockCategories.find(category => category.slug === slug);
  return category || null;
};

// Create a new category (for admin)
export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    ...categoryData
  };
  
  // In a real app, we would send this to a backend
  // For now, just return the new category
  return newCategory;
};

// Update a category (for admin)
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<Category> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const category = await getCategoryById(id);
  if (!category) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  // In a real app, we would send this to a backend
  // For now, just return the updated category
  return {
    ...category,
    ...categoryData
  };
};

// Delete a category (for admin)
export const deleteCategory = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, we would send this to a backend
  // For now, just return
  return;
}; 