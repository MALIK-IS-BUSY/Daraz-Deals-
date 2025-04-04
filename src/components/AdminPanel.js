import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });

    useEffect(() => {
        // Fetch products from the backend on page load
        axios.get('http://localhost:5000/api/products')
            .then((response) => setProducts(response.data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    const handleAddProduct = () => {
        // Send a POST request to add a new product
        axios.post('http://localhost:5000/api/products', newProduct)
            .then(() => {
                setProducts([...products, newProduct]);
                setNewProduct({ name: '', price: '' });
            })
            .catch((error) => console.error('Error adding product:', error));
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <div>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Product Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <button onClick={handleAddProduct}>Add Product</button>
            </div>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>{product.name} - ${product.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
