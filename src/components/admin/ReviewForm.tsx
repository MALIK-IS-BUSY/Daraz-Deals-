import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';
import { Review } from '../../types/product';
import { updateReview, deleteReview, addReview } from '../../services/productService';

interface ReviewFormProps {
  review: Review & { productTitle?: string };
  productId: string;
  onClose: () => void;
  onSubmit: () => void;
  isNew?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ review, productId, onClose, onSubmit, isNew = false }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with review data
  useEffect(() => {
    if (review) {
      setUserName(review.userName || '');
      setRating(review.rating || 5);
      setComment(review.comment || '');
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isNew) {
        // Create a new review
        await addReview(
          productId,
          userName,
          rating,
          comment
        );
      } else {
        // Update existing review
        await updateReview(
          productId,
          review.id,
          {
            userName,
            rating,
            comment,
          }
        );
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving review:', error);
      setError(`Failed to ${isNew ? 'add' : 'update'} review. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await deleteReview(productId, review.id);
      onSubmit();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (!userName.trim()) {
      return 'User name is required';
    }
    
    if (!comment.trim()) {
      return 'Comment is required';
    }
    
    return null;
  };

  return (
    <FormOverlay>
      <FormContainer>
        <FormHeader>
          <FormTitle>{isNew ? 'Add New Review' : 'Edit Review'}</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>
        
        {review.productTitle && (
          <ProductInfo>
            <ProductLabel>Product:</ProductLabel>
            <ProductName>{review.productTitle}</ProductName>
          </ProductInfo>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
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
          
          <FormActions>
            {!isNew && (
              <DeleteButton 
                type="button" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete Review
              </DeleteButton>
            )}
            <div>
              <CancelButton 
                type="button" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </CancelButton>
              <SubmitButton 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isNew ? 'Add Review' : 'Update Review')}
              </SubmitButton>
            </div>
          </FormActions>
        </Form>
      </FormContainer>
    </FormOverlay>
  );
};

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
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

const ProductInfo = styled.div`
  padding: 15px 20px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProductLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.lightText};
`;

const ProductName = styled.span`
  color: ${props => props.theme.colors.text};
`;

const ErrorMessage = styled.div`
  padding: 15px 20px;
  margin: 0 20px 20px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-top: 20px;
`;

const Form = styled.form`
  padding: 0 20px 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
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

const FormActions = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  margin-right: 10px;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

const DeleteButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.error};
    color: white;
  }
`;

export default ReviewForm; 