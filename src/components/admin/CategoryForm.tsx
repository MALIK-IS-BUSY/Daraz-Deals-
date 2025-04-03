import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { Category } from '../../types/category';
import { createCategory, updateCategory } from '../../services/categoryService';
import { slugify } from '../../utils/format';

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
  onSubmit: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with category data if editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setImage(category.image || '');
      setIsGeneratingSlug(false);
    } else {
      resetForm();
    }
  }, [category]);

  // Auto-generate slug when name changes (if auto-generate is enabled)
  useEffect(() => {
    if (isGeneratingSlug && name) {
      setSlug(slugify(name));
    }
  }, [name, isGeneratingSlug]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setImageFile(null);
    setError('');
    setIsGeneratingSlug(true);
  };

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!slug.trim()) return 'Slug is required';
    return '';
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsGeneratingSlug(false);
    setSlug(e.target.value);
  };

  const handleResetSlug = () => {
    setIsGeneratingSlug(true);
    setSlug(slugify(name));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImageFile(selectedFile);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleOpenFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      const categoryData = {
        name,
        slug,
        description: description || undefined,
        image: image || undefined
      };
      
      if (category) {
        await updateCategory(category.id, categoryData, imageFile || undefined);
      } else {
        await createCategory(categoryData, imageFile || undefined);
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormOverlay>
      <FormContainer>
        <FormHeader>
          <FormTitle>{category ? 'Edit Category' : 'Add New Category'}</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Category Name*</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="slug">
              Slug*
              {!isGeneratingSlug && (
                <ResetSlugButton type="button" onClick={handleResetSlug}>
                  Auto-generate
                </ResetSlugButton>
              )}
            </Label>
            <Input
              id="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="Enter slug for URL"
              required
            />
            <HelperText>Used in URLs, e.g., /category/{slug}</HelperText>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description (optional)"
              rows={4}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Category Image</Label>
            <ImageContainer>
              {image ? (
                <ImagePreview>
                  <img src={image} alt="Category preview" />
                  <RemoveImageButton type="button" onClick={handleRemoveImage}>
                    <FaTimes />
                  </RemoveImageButton>
                </ImagePreview>
              ) : (
                <ImageUploadButton type="button" onClick={handleOpenFileInput}>
                  <FaUpload /> Upload Image
                </ImageUploadButton>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </ImageContainer>
          </FormGroup>
          
          <ButtonsContainer>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Add Category')}
            </SubmitButton>
          </ButtonsContainer>
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${props => props.theme.colors.darkGray};
  transition: color 0.3s;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const Form = styled.form`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const ResetSlugButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
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

const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.lightText};
  margin-top: 5px;
`;

const ErrorMessage = styled.div`
  padding: 10px 15px;
  margin: 15px 20px 0;
  background-color: #ffeeee;
  border-left: 4px solid ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.error};
  border-radius: 4px;
  font-size: 14px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageUploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${props => props.theme.colors.lightGray};
  color: ${props => props.theme.colors.text};
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  height: 120px;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.mediumGray};
  }
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    order: 2;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.darkGray};
    cursor: not-allowed;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    order: 1;
    margin-bottom: 10px;
  }
`;

export default CategoryForm; 