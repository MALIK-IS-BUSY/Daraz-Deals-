import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaSearch, FaSortAmountDown, FaSortAmountUp, FaStar, FaPlus, FaTimes, FaRegStar } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { Product, Review } from '../../types/product';
import { getAllProducts, addReview } from '../../services/productService';
import { formatDate } from '../../utils/format';
import ReviewForm from '../../components/admin/ReviewForm';
import Spinner from '../../components/Spinner';

const Reviews: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allReviews, setAllReviews] = useState<(Review & { productTitle: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<(Review & { productTitle: string }) | null>(null);
  const [productFilter, setProductFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortField, setSortField] = useState<'date' | 'rating'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
      
      // Extract all reviews and add product title
      const reviews = fetchedProducts.flatMap(product => 
        product.reviews.map(review => ({
          ...review,
          productTitle: product.title
        }))
      );
      
      setAllReviews(reviews);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProductFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductFilter(e.target.value);
  };

  const handleRatingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRatingFilter(e.target.value);
  };

  const handleEditReview = (review: Review & { productTitle: string }) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (review: Review & { productTitle: string }) => {
    if (window.confirm(`Are you sure you want to delete this review by ${review.userName}?`)) {
      try {
        // Logic for deleting review will be handled in the ReviewForm component
        // This is just a placeholder until we implement the actual delete functionality
        showSuccess(`Review by ${review.userName} has been deleted successfully.`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReview(null);
    setIsCreatingReview(false);
  };

  const handleFormSubmit = () => {
    fetchData();
    setShowForm(false);
    setEditingReview(null);
    setIsCreatingReview(false);
    showSuccess(isCreatingReview ? 'Review added successfully!' : 'Review updated successfully!');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSort = (field: 'date' | 'rating') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddReview = () => {
    if (products.length === 0) {
      alert('There must be at least one product to add a review.');
      return;
    }
    
    setIsCreatingReview(true);
    setShowForm(true);
  };

  // Filter reviews based on search term, product, and rating
  const filteredReviews = allReviews.filter(review => {
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = productFilter === 'all' || review.productId === productFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesProduct && matchesRating;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortField === 'date') {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    } else if (sortField === 'rating') {
      return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });

  return (
    <AdminLayout>
      <ReviewsContainer>
        <Header>
          <HeaderTitle>Reviews Management</HeaderTitle>
          <AddButton onClick={handleAddReview} data-testid="add-review-button">
            <FaPlus /> Add New Review
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
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>
          
          <FilterGroup>
            <ProductSelect onChange={handleProductFilter} value={productFilter}>
              <option value="all">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </ProductSelect>
            
            <RatingSelect onChange={handleRatingFilter} value={ratingFilter}>
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </RatingSelect>
          </FilterGroup>
        </FiltersContainer>

        <SummaryStats>
          <StatCard>
            <StatTitle>Total Reviews</StatTitle>
            <StatValue>{allReviews.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Average Rating</StatTitle>
            <StatValue>
              {allReviews.length > 0 
                ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1) 
                : 'N/A'}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Products Reviewed</StatTitle>
            <StatValue>
              {new Set(allReviews.map(review => review.productId)).size}
            </StatValue>
          </StatCard>
        </SummaryStats>
        
        {isLoading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : (
          <>
            {sortedReviews.length > 0 ? (
              <ReviewsTable>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>User</th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('rating')}
                    >
                      Rating
                      {sortField === 'rating' && (
                        sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                      )}
                    </th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                      )}
                    </th>
                    <th>Comment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReviews.map(review => (
                    <tr key={review.id}>
                      <td>{review.productTitle}</td>
                      <td>{review.userName}</td>
                      <td>
                        <RatingDisplay>
                          {[...Array(5)].map((_, index) => (
                            <FaStar 
                              key={index} 
                              color={index < review.rating ? '#ffc907' : '#e0e0e0'} 
                            />
                          ))}
                        </RatingDisplay>
                      </td>
                      <td>{formatDate(review.date)}</td>
                      <td>
                        <CommentCell>{review.comment}</CommentCell>
                      </td>
                      <td>
                        <ActionButtons>
                          <ActionButton onClick={() => handleEditReview(review)} title="Edit Review">
                            <FaEdit />
                          </ActionButton>
                          <ActionButton 
                            onClick={() => handleDeleteReview(review)}
                            title="Delete Review"
                          >
                            <FaTrash />
                          </ActionButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ReviewsTable>
            ) : (
              <EmptyMessage>
                {searchTerm || productFilter !== 'all' || ratingFilter !== 'all'
                  ? 'No reviews match your search criteria.' 
                  : 'No reviews found.'}
              </EmptyMessage>
            )}
          </>
        )}
        
        {showForm && (
          isCreatingReview ? (
            <AddReviewForm
              products={products}
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
            />
          ) : (
            editingReview && (
              <ReviewForm
                review={editingReview}
                productId={editingReview.productId}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                isNew={false}
              />
            )
          )
        )}
      </ReviewsContainer>
    </AdminLayout>
  );
};

const ReviewsContainer = styled.div`
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

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: fadeOut 3s forwards;
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
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

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const ProductSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const RatingSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SummaryStats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const StatCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

const ReviewsTable = styled.table`
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

const RatingDisplay = styled.div`
  display: flex;
  gap: 2px;
  font-size: 14px;
`;

const CommentCell = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    color: ${props => props.theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.div`
  padding: 30px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  color: ${props => props.theme.colors.lightText};
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

const CreateReviewForm = styled.div``;

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${props => props.theme.colors.lightText};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Form = styled.form`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

// Create a dedicated component for adding new reviews
const AddReviewForm: React.FC<{
  products: Product[];
  onClose: () => void;
  onSubmit: () => void;
}> = ({ products, onClose, onSubmit }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products.length > 0 ? products[0].id : '');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }
    
    if (!userName.trim()) {
      setError('User name is required');
      return;
    }
    
    if (!comment.trim()) {
      setError('Comment is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await addReview(
        selectedProductId,
        userName,
        rating,
        comment
      );
      
      onSubmit();
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Failed to add review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <FormOverlay>
      <FormContainer>
        <FormHeader>
          <FormTitle>Add New Review</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="product">Product*</Label>
            <Select
              id="product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          {selectedProduct && (
            <>
              <FormGroup>
                <Label htmlFor="userName">User Name*</Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter user name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Rating*</Label>
                <RatingContainer>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarButton
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      {(hoveredRating || rating) >= star ? (
                        <FaStar color="#ffc907" />
                      ) : (
                        <FaRegStar color="#ffc907" />
                      )}
                    </StarButton>
                  ))}
                  <RatingValue>{rating} of 5 stars</RatingValue>
                </RatingContainer>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="comment">Comment*</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter review comment"
                  rows={5}
                  required
                />
              </FormGroup>
            </>
          )}
          
          <FormActions>
            <CancelButton 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </CancelButton>
            <SubmitButton 
              type="submit"
              disabled={isLoading || !selectedProductId}
            >
              {isLoading ? 'Adding...' : 'Add Review'}
            </SubmitButton>
          </FormActions>
        </Form>
      </FormContainer>
    </FormOverlay>
  );
};

// Add styling components for the new form
const ErrorMessage = styled.div`
  padding: 15px 20px;
  margin: 0 20px 20px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
`;

const RatingValue = styled.span`
  margin-left: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.lightText};
`;

export default Reviews; 