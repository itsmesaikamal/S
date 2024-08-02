import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InsertRawMaterials from './InsertRawMaterials';
import ViewRawMaterials from './ViewRawMaterials';
import AvailableRawMaterials from './AvailableRawMaterials';
import ConsumedRawMaterials from './ConsumedRawMaterials';

const RawMaterials = () => {
  return (
    <Routes>
      <Route path="insert" element={<InsertRawMaterials />} />
      <Route path="view" element={<ViewRawMaterials />} />
      <Route path="available" element={<AvailableRawMaterials />} />
      <Route path="consumed" element={<ConsumedRawMaterials />} />
    </Routes>
  );
};

export default RawMaterials;
