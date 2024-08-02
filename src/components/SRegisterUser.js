// src/components/RegisterUser.js
import React, { useState } from 'react';
import { db } from './Sfirebase';
import { collection, addDoc } from 'firebase/firestore';
import './SRegisterUser.css';

const SRegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    district: '',
    userType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = generateRandomPassword();
    try {
      await addDoc(collection(db, "registrations"), { ...formData, password });
      alert("User registered successfully!");
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        district: '',
        userType: '',
      });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register User</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
        <select name="state" value={formData.state} onChange={handleChange}>
          <option value="">Select State</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Telangana">Telangana</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Kerala">Kerala</option>
        </select>
        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
        />
        <select name="userType" value={formData.userType} onChange={handleChange}>
          <option value="">Select User Type</option>
          <option value="Factory">Factory</option>
          <option value="District">District</option>
          <option value="Mandal">Mandal</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SRegisterUser;
