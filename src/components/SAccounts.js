import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Sfirebase'; // Ensure you have the Firebase setup
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './SAccounts.css';

const SAccounts = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [rawMaterialsCount, setRawMaterialsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const rawMaterialsSnapshot = await getDocs(collection(db, 'rawMaterials'));
      const ordersSnapshot = await getDocs(collection(db, 'DOrders'));
      const productsSnapshot = await getDocs(collection(db, 'products'));

      const rawMaterialsData = rawMaterialsSnapshot.docs.map(doc => doc.data());
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      const productsData = productsSnapshot.docs.map(doc => doc.data());

      setRawMaterials(rawMaterialsData);
      setOrders(ordersData);
      setProducts(productsData);

      setRawMaterialsCount(rawMaterialsSnapshot.size);
      setOrdersCount(ordersSnapshot.size);
      setProductsCount(productsSnapshot.size);

      const totalExpenses = rawMaterialsData.reduce((sum, item) => sum + parseFloat(item.price), 0);
      const totalEarnings = ordersData.reduce((sum, item) => sum + item.totalAmount, 0);
      const totalProfitOrLoss = totalEarnings - totalExpenses;

      setExpenses(totalExpenses);
      setEarnings(totalEarnings);
      setProfitOrLoss(totalProfitOrLoss);
    };

    fetchData();
  }, []);

  const data = [
    { name: 'Expenses', value: expenses },
    { name: 'Earnings', value: earnings },
    { name: 'Profit/Loss', value: profitOrLoss },
  ];

  const COLORS = ['#FF8042', '#0088FE', '#00C49F'];

  return (
    <div className="accounts-container">
      <h2>Ice Cream Business Dashboard</h2>
      <div className="cards-container">
        <div className="card raw-materials-card">
          <h3>Raw Materials</h3>
          <p>{rawMaterialsCount}</p>
        </div>
        <div className="card orders-card">
          <h3>Orders</h3>
          <p>{ordersCount}</p>
        </div>
        <div className="card products-card">
          <h3>Products</h3>
          <p>{productsCount}</p>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="pie-chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SAccounts;
