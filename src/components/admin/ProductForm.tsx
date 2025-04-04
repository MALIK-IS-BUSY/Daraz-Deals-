import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { createProduct, updateProduct } from '../../services/productService';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price.toString());
      setDiscountPrice(product.discountPrice ? product.discountPrice.toString() : '');
      setStock(product.stockQuantity.toString());
      setCategoryId(product.categoryId);
      setBrand(product.brand || '');
      setImages(product.images || []);
      setFeatures(product.features || []);
      setAffiliateUrl(product.affiliateUrl || '');
    } else {
      // Default values for new product
      setTitle('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      setStock('10');
      setBrand('');
      setImages([]);
      setFeatures([]);
      setAffiliateUrl('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
    }
  }, [product, categories]);

  const validateForm = () => {
    if (!title.trim()) return 'Title is required';
    if (!description.trim()) return 'Description is required';
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) return 'Valid price is required';
    if (discountPrice.trim() && (isNaN(Number(discountPrice)) || Number(discountPrice) <= 0 || Number(discountPrice) >= Number(price))) {
      return 'Discount price must be less than the regular price';
    }
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) return 'Valid stock quantity is required';
    if (!categoryId) return 'Category is required';
    if (images.length === 0) return 'At least one image is required';
    return '';
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    
    // Basic validation for URL format
    if (!newImageUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      setError('Please enter a valid image URL');
      return;
    }
    
    setImages([...images, newImageUrl]);
    setNewImageUrl('');
    setError('');
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature]);
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
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
      const productData: Omit<Product, 'id' | 'rating' | 'reviews'> = {
        title,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stockQuantity: Number(stock),
        categoryId,
        brand: brand || undefined,
        images,
        features,
        affiliateUrl: affiliateUrl || undefined,
        createdAt: product ? product.createdAt : new Date(),
        updatedAt: new Date(),
        slug: product ? product.slug : title.toLowerCase().replace(/\s+/g, '-')
      };
      
      if (product) {
        await updateProduct(product.id, productData, imageFile || undefined);
      } else {
        await createProduct(productData, imageFile || undefined);
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImageFile(selectedFile);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImages([...images, result]);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleOpenFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <FormOverlay>
      <FormContainer>
        <FormHeader>
          <FormTitle>{product ? 'Edit Product' : 'Add New Product'}</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Product Title*</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="price">Price*</Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Regular price"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="discountPrice">Discount Price</Label>
              <Input
                id="discountPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional discount price"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="stock">Stock Quantity*</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Available stock"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name (optional)"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="affiliateUrl">Affiliate URL</Label>
            <Input
              id="affiliateUrl"
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="Enter the affiliate link for this product"
            />
            <HelperText>The link where customers will be redirected when clicking "Buy on Daraz"</HelperText>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="category">Category*</Label>
            <Select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Product Images*</Label>
            <InputGroup>
              <Input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                onKeyPress={handleImageKeyPress}
              />
              <Button type="button" onClick={handleAddImage}>
                <FaPlus /> Add URL
              </Button>
            </InputGroup>
            <HelperText>Add image URLs or upload images directly</HelperText>
            
            <UploadButton type="button" onClick={handleOpenFileInput}>
              <FaUpload /> Upload Image from Device
            </UploadButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {images.length > 0 && (
              <ImagesGrid>
                {images.map((image, index) => (
                  <ImageItem key={index}>
                    <ImagePreview src={image} alt={`Product ${index + 1}`} />
                    <RemoveButton onClick={() => handleRemoveImage(index)}>
                      <FaTrash />
                    </RemoveButton>
                  </ImageItem>
                ))}
              </ImagesGrid>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label>Product Features</Label>
            <InputGroup>
              <Input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter a product feature"
                onKeyPress={handleFeatureKeyPress}
              />
              <Button type="button" onClick={handleAddFeature}>
                <FaPlus /> Add
              </Button>
            </InputGroup>
            <HelperText>Add key features of your product</HelperText>
            
            {features.length > 0 && (
              <FeaturesList>
                {features.map((feature, index) => (
                  <FeatureItem key={index}>
                    <FeatureText>{feature}</FeatureText>
                    <RemoveFeatureButton onClick={() => handleRemoveFeature(index)}>
                      <FaTrash />
                    </RemoveFeatureButton>
                  </FeatureItem>
                ))}
              </FeaturesList>
            )}
          </FormGroup>
          
          <FormActions>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Save Product')}
            </SubmitButton>
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
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
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
  color: ${props => props.theme.colors.text};
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

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 20px;
  margin: 20px;
  border-radius: 4px;
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
  color: ${props => props.theme.colors.text};
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

const Select = styled.select`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  & > * {
    flex: 1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  
  & > button {
    flex-shrink: 0;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.lightText};
  margin-top: 5px;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const ImageItem = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  color: ${props => props.theme.colors.error};
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: white;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0 0;
`;

const FeatureItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const FeatureText = styled.div`
  word-break: break-word;
`;

const RemoveFeatureButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    color: ${props => props.theme.colors.errorDark};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(ActionButton)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const CancelButton = styled(ActionButton)`
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

const UploadButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  margin-top: 10px;
`;

export default ProductForm; 