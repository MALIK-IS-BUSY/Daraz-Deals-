import { Product } from '../types/product';
import { mockProducts } from './mockData';
import axios from 'axios';

// API base URL - change this to your actual backend URL
const API_URL = 'http://localhost:5000/api';

// Initialize products from API or localStorage as fallback
let localProducts: Product[] = [];

// Helper function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to calculate average rating
const calculateAverageRating = (reviews: Array<{ rating: number }>): number => {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // Try to fetch from API first
    const response = await axios.get(`${API_URL}/products`);
    localProducts = response.data;
    // Update localStorage with the latest data
    localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    return localProducts;
  } catch (error) {
    console.error('Error fetching products from API:', error);
    // Fallback to localStorage if API fails
    try {
      const storedProducts = localStorage.getItem('daraz_mock_products');
      if (storedProducts) {
        localProducts = JSON.parse(storedProducts);
        return localProducts;
      }
    } catch (localError) {
      console.error('Error reading from localStorage:', localError);
    }
    // Last resort: use mock data
    localProducts = [...mockProducts];
    return localProducts;
  }
};

// Get products with pagination
export const getProducts = async (page: number = 1, limit: number = 10): Promise<Product[]> => {
  // Ensure we have the latest products
  if (localProducts.length === 0) {
    await getAllProducts();
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return localProducts.slice(startIndex, endIndex);
};

// Get products by category
export const getProductsByCategory = async (
  categoryId: string, 
  limit: number = 10, 
  lastVisible: any = null
): Promise<{ products: Product[], lastVisible: any }> => {
  // Ensure we have the latest products
  if (localProducts.length === 0) {
    await getAllProducts();
  }
  
  const filtered = localProducts.filter(product => product.categoryId === categoryId);
  
  // If empty category, return empty result
  if (filtered.length === 0) {
    return { products: [], lastVisible: null };
  }
  
  // For pagination simulation
  let startIndex = 0;
  if (lastVisible) {
    const lastIndex = filtered.findIndex(p => p.id === lastVisible);
    if (lastIndex !== -1) {
      startIndex = lastIndex + 1;
    }
  }
  
  const endIndex = startIndex + limit;
  const products = filtered.slice(startIndex, endIndex);
  const newLastVisible = products.length > 0 ? products[products.length - 1].id : null;
  
  return { 
    products, 
    lastVisible: newLastVisible 
  };
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // Try to fetch from API first
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id} from API:`, error);
    
    // Fallback to local cache
    if (localProducts.length === 0) {
      await getAllProducts();
    }
    
    return localProducts.find(product => product.id === id) || null;
  }
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  // Ensure we have the latest products
  if (localProducts.length === 0) {
    await getAllProducts();
  }
  
  return localProducts.find(product => product.slug === slug) || null;
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Ensure we have the latest products
  if (localProducts.length === 0) {
    await getAllProducts();
  }
  
  const searchTerm = query.toLowerCase();
  return localProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );
};

// Create a new product
export const createProduct = async (
  productData: Omit<Product, 'id' | 'rating' | 'reviews'>, 
  imageFile?: File
): Promise<Product> => {
  // Handle image file upload if present
  let processedImages = [...productData.images];
  if (imageFile) {
    // In a real application, this would upload the file to a server/cloud storage
    processedImages = processedImages.filter(img => !img.startsWith('data:'));
  }
  
  const productToCreate = {
    ...productData,
    images: processedImages,
    slug: generateSlug(productData.title),
    rating: 0,
    reviews: []
  };
  
  try {
    // Send to API
    const response = await axios.post(`${API_URL}/products`, productToCreate);
    const newProduct = response.data.product;
    
    // Update local cache
    localProducts.push(newProduct);
    
    // Update localStorage as backup
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    return newProduct;
  } catch (error) {
    console.error('Error creating product on API:', error);
    
    // Fallback: Create locally only
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      ...productToCreate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    localProducts.push(newProduct);
    
    // Save to localStorage
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    return newProduct;
  }
};

// Update a product
export const updateProduct = async (
  id: string, 
  productData: Partial<Omit<Product, 'id'>>,
  imageFile?: File
): Promise<Product> => {
  const localIndex = localProducts.findIndex(product => product.id === id);
  if (localIndex === -1) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  // Handle image file upload if present
  let processedImages = productData.images ? [...productData.images] : [...localProducts[localIndex].images];
  if (imageFile) {
    processedImages = processedImages.filter(img => !img.startsWith('data:'));
  }
  
  const dataToUpdate = {
    ...productData,
    images: processedImages
  };
  
  try {
    // Send to API
    const response = await axios.put(`${API_URL}/products/${id}`, dataToUpdate);
    const updatedProduct = response.data.product;
    
    // Update local cache
    localProducts[localIndex] = updatedProduct;
    
    // Update localStorage as backup
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product on API:', error);
    
    // Fallback: Update locally only
    const updatedProduct = {
      ...localProducts[localIndex],
      ...dataToUpdate,
      updatedAt: new Date()
    };
    
    localProducts[localIndex] = updatedProduct;
    
    // Save to localStorage
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    return updatedProduct;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    // Delete from API
    await axios.delete(`${API_URL}/products/${id}`);
    
    // Update local cache
    localProducts = localProducts.filter(product => product.id !== id);
    
    // Update localStorage
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  } catch (error) {
    console.error('Error deleting product from API:', error);
    
    // Fallback: Delete locally only
    localProducts = localProducts.filter(product => product.id !== id);
    
    // Save to localStorage
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

// Add a review to a product
export const addReview = async (
  productId: string, 
  userName: string, 
  rating: number, 
  comment: string
): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = localProducts.findIndex(product => product.id === productId);
  if (index === -1) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  const review = {
    id: `review-${Date.now()}`,
    productId,
    userName,
    rating,
    comment,
    date: new Date()
  };
  
  // Update the product with the new review
  const product = localProducts[index];
  const updatedProduct = {
    ...product,
    reviews: [...product.reviews, review],
    rating: calculateAverageRating([...product.reviews, review])
  };
  
  // Replace in our array
  localProducts[index] = updatedProduct;
  
  // Save to localStorage to persist between refreshes
  try {
    localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return updatedProduct;
};

// Update a review
export const updateReview = async (
  productId: string,
  reviewId: string,
  reviewData: Partial<{ userName: string, rating: number, comment: string }>
): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productIndex = localProducts.findIndex(product => product.id === productId);
  if (productIndex === -1) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  const product = localProducts[productIndex];
  const reviewIndex = product.reviews.findIndex(review => review.id === reviewId);
  
  if (reviewIndex === -1) {
    throw new Error(`Review with ID ${reviewId} not found`);
  }
  
  // Update the review
  const updatedReviews = [...product.reviews];
  updatedReviews[reviewIndex] = {
    ...updatedReviews[reviewIndex],
    ...reviewData
  };
  
  // Update the product with the updated review
  const updatedProduct = {
    ...product,
    reviews: updatedReviews,
    rating: calculateAverageRating(updatedReviews)
  };
  
  // Replace in our array
  localProducts[productIndex] = updatedProduct;
  
  // Save to localStorage to persist between refreshes
  try {
    localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return updatedProduct;
};

// Delete a review
export const deleteReview = async (
  productId: string,
  reviewId: string
): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productIndex = localProducts.findIndex(product => product.id === productId);
  if (productIndex === -1) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  const product = localProducts[productIndex];
  const updatedReviews = product.reviews.filter(review => review.id !== reviewId);
  
  // Update the product with the updated reviews
  const updatedProduct = {
    ...product,
    reviews: updatedReviews,
    rating: calculateAverageRating(updatedReviews)
  };
  
  // Replace in our array
  localProducts[productIndex] = updatedProduct;
  
  // Save to localStorage to persist between refreshes
  try {
    localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return updatedProduct;
};

// Load saved products from localStorage on initialization
try {
  const savedProducts = localStorage.getItem('daraz_mock_products');
  if (savedProducts) {
    localProducts = JSON.parse(savedProducts);
  }
} catch (error) {
  console.error('Error loading from localStorage:', error);
} 