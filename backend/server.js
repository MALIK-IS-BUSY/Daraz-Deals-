const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique IDs
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Path to the JSON file
const dataFilePath = path.join(__dirname, 'products.json');

// Helper function to read data from the JSON file
const readData = () => {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Endpoint to fetch all products
app.get('/api/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// Endpoint to add a new product
app.post('/api/products', (req, res) => {
    const products = readData();
    const newProduct = { id: uuidv4(), ...req.body }; // Assign a unique ID
    products.push(newProduct);
    writeData(products);
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// Endpoint to edit a product by ID
app.put('/api/products/:id', (req, res) => {
    const products = readData();
    const productId = req.params.id;
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = { ...products[productIndex], ...req.body }; // Update product
    writeData(products);
    res.json({ message: 'Product updated successfully', product: products[productIndex] });
});

// Endpoint to fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
    const products = readData();
    const product = products.find((product) => product.id === req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
});

// Endpoint to delete a product by ID
app.delete('/api/products/:id', (req, res) => {
    const products = readData();
    const productIndex = products.findIndex((product) => product.id === req.params.id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1);
    writeData(products);
    res.json({ message: 'Product deleted successfully', product: deletedProduct[0] });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
