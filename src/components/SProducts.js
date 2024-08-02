import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SInsertProducts from './SInsertProducts';
import SViewProducts from './SViewProducts';

const SProducts = () => {
  return (
    <Routes>
      <Route path="insert" element={<SInsertProducts />} />
      <Route path="view" element={<SViewProducts />} />
    </Routes>
  );
};

export default SProducts;
