const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Path to our JSON database file
const dbFilePath = path.join(__dirname, 'products.json');

// Function to read products from file
const readProducts = () => {
  try {
    if (fs.existsSync(dbFilePath)) {
      const fileData = fs.readFileSync(dbFilePath, 'utf8');
      return JSON.parse(fileData);
    }
    // If file doesn't exist, create it with empty array
    fs.writeFileSync(dbFilePath, JSON.stringify([], null, 2));
    return [];
  } catch (error) {
    console.error('Error reading from products.json:', error);
    return [];
  }
};

// Function to write products to file
const writeProducts = (products) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to products.json:', error);
    return false;
  }
};

// Endpoint to fetch all products
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to add a new product
app.post('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = { 
      id: uuidv4(), 
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    products.push(newProduct);
    writeProducts(products);
    
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to edit a product by ID
app.put('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    products[productIndex] = updatedProduct;
    writeProducts(products);
    
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to delete a product by ID
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    writeProducts(products);
    
    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Products are stored in: ${dbFilePath}`);
});
