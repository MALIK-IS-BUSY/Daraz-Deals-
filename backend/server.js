const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique IDs
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/daraz', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a Product schema
const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

// Create a Product model
const Product = mongoose.model('Product', productSchema);

// Endpoint to fetch all products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Endpoint to add a new product
app.post('/api/products', async (req, res) => {
    const newProduct = new Product({ id: uuidv4(), ...req.body });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// Endpoint to edit a product by ID
app.put('/api/products/:id', async (req, res) => {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product });
});

// Endpoint to fetch a single product by ID
app.get('/api/products/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// Endpoint to delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', product });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
