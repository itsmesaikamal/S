import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SNavbar from './SNavbar';
import SearchBar from './SearchBar';
import SProducts from './SProducts';
import SOrders from './SOrders';
import SInvoice from './SInvoice';
import SAccounts from './SAccounts';
import SViewUsers from './SViewUsers';
import SRegisterUser from './SRegisterUser';
import './SHome.css';

const SHome = () => {
  return (
    <div className="home-container">
      <SNavbar />
      <div className="main-content">
        
        <Routes>
          <Route path="products/*" element={<SProducts />} />
          <Route path="orders" element={<SOrders />} />
          <Route path="invoice" element={<SInvoice />} />
          <Route path="accounts" element={<SAccounts />} />
          <Route path="register" element={<SRegisterUser />} />
          <Route path="users" element={<SViewUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default SHome;
