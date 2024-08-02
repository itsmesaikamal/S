import React, { useState } from 'react';
import { db, storage } from './Sfirebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './SInsertProducts.css';

const SInsertProducts = () => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturedDate, setManufacturedDate] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const imageRef = ref(storage, `products/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(db, 'products'), {
        productName,
        quantity,
        price,
        manufacturedDate,
        imageUrl
      });
      alert('Product added successfully!');
      setProductName('');
      setQuantity('');
      setPrice('');
      setManufacturedDate('');
      setImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="insert-products">
      <h2>Insert Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="manufacturedDate">Manufactured Date</label>
          <input
            type="date"
            id="manufacturedDate"
            value={manufacturedDate}
            onChange={(e) => setManufacturedDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SInsertProducts;
