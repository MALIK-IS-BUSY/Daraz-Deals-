import { Product } from '../types/product';
import { mockProducts } from './mockData';

// Store products locally to maintain state between page refreshes
let localProducts = [...mockProducts];

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return localProducts;
};

// Get products with pagination
export const getProducts = async (page: number = 1, limit: number = 10): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const product = localProducts.find(product => product.id === id);
  return product || null;
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const product = localProducts.find(product => product.slug === slug);
  return product || null;
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const searchTerm = query.toLowerCase();
  return localProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviews'>): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newProduct: Product = {
    id: `product-${Date.now()}`,
    rating: 0,
    reviews: [],
    ...productData,
    slug: generateSlug(productData.title)
  };
  
  // Add to our local products array
  localProducts.push(newProduct);
  
  // Save to localStorage to persist between refreshes
  try {
    localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return newProduct;
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = localProducts.findIndex(product => product.id === id);
  if (index === -1) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  // Update the product
  const updatedProduct = {
    ...localProducts[index],
    ...productData,
    updatedAt: new Date()
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

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = localProducts.findIndex(product => product.id === id);
  if (index !== -1) {
    localProducts.splice(index, 1);
    
    // Save to localStorage to persist between refreshes
    try {
      localStorage.setItem('daraz_mock_products', JSON.stringify(localProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return;
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

// Helper function to calculate average rating
const calculateAverageRating = (reviews: Array<{ rating: number }>): number => {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

// Helper function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
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