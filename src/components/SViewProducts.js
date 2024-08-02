import React, { useEffect, useState } from 'react';
import { db } from './Sfirebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './SViewProducts.css';

const SViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: '',
    quantity: '',
    price: '',
    manufacturedDate: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      manufacturedDate: product.manufacturedDate
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, 'products', editingProduct);
      await updateDoc(productRef, {
        ...editForm,
        price: Number(editForm.price) // Ensure price is a number
      });
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === editingProduct ? { ...product, ...editForm, price: Number(editForm.price) } : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="view-products">
      <h2>View Products</h2>
      {editingProduct && (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <h3>Edit Product</h3>
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={editForm.productName}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={editForm.quantity}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Price:
            <input
              type="text"
              name="price"
              value={editForm.price}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Manufactured Date:
            <input
              type="date"
              name="manufacturedDate"
              value={editForm.manufacturedDate}
              onChange={handleEditChange}
              required
            />
          </label>
          <button type="submit">Save Changes</button>
        </form>
      )}
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.productName} className="product-image" />
            <div className="product-details">
              <h3>{product.productName}</h3>
              <p>Price: ${Number(product.price).toFixed(2)}</p>
              <p>Quantity: {product.quantity}</p>
              <div className="product-actions">
                <FaEdit
                  onClick={() => handleEditClick(product)}
                  className="icon edit-icon"
                />
                <FaTrash
                  onClick={() => handleDeleteClick(product.id)}
                  className="icon delete-icon"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SViewProducts;
