import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // Fetch all products
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Add a new product
  const addProduct = () => {
    axios.post('http://localhost:5000/api/products', newProduct)
      .then((response) => {
        setProducts([...products, response.data.product]);
        setNewProduct({ name: '', price: '' });
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  // Delete a product
  const deleteProduct = (id) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => setProducts(products.filter((product) => product.id !== id)))
      .catch((error) => console.error('Error deleting product:', error));
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button onClick={addProduct}>Add</button>
      </div>
      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
