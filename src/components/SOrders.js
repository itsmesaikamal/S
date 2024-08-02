import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './Sfirebase';
import './SOrders.css';


const SOrders = () => {
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [items, setItems] = useState([{ item: '', cost: '', quantity: '', price: '' }]);
  const [formData, setFormData] = useState({
    factoryDetails: 'Office Guntur, Nallapadu',
    factoryPhoneNumber: '1324563678',
    invoiceNumber: Math.floor(100000 + Math.random() * 900000),
    invoiceTo: '',
    customerAddress: '',
    dateIssued: '',
    dueDate: '',
    salesPerson: '',
    greeting: 'Thank you for business',
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const registrationsSnapshot = await getDocs(collection(db, 'registrations'));
        const ordersSnapshot = await getDocs(collection(db, 'DOrders'));

        const registrationsData = registrationsSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          if (data.email) {
            acc[data.email] = { ...data, source: 'registrations' };
          }
          return acc;
        }, {});

        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          source: 'DOrders'
        }));

        const combinedData = ordersData.map(order => {
          const registration = registrationsData[order.email];
          return { ...order, ...registration };
        });

        const allColumns = new Set();
        combinedData.forEach(order => {
          Object.keys(order).forEach(key => {
            if (key !== 'id' && key !== 'source') {
              allColumns.add(key);
            }
          });
        });

        setColumns([...allColumns]);
        setOrders(combinedData);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    fetchOrders();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { item: '', cost: '', quantity: '', price: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    const newSubtotal = newItems.reduce((sum, item) => sum + (item.price ? parseFloat(item.price) : 0), 0);
    setFormData(prevFormData => ({
      ...prevFormData,
      subtotal: newSubtotal,
      total: newSubtotal - prevFormData.discount + prevFormData.tax
    }));
  };

  const handleFormDataChange = (field, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
      total: prevFormData.subtotal - prevFormData.discount + prevFormData.tax
    }));
  };

  const handleGenerateInvoice = async () => {
    try {
      await addDoc(collection(db, 'factory-invoice'), { ...formData, items });
      console.log('Invoice successfully stored in Firestore');
    } catch (error) {
      console.error('Error storing invoice: ', error);
    }
    setShowInvoiceForm(false);
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <div className="orders-table">
        <div className="table-header">
          {columns.map(column => (
            <div key={column} className="header-cell">{column}</div>
          ))}
          <div className="header-cell">Action</div>
        </div>
        {orders.map(order => (
          <div key={order.id} className="table-row">
            {columns.map(column => (
              <div key={column} className="table-cell">{order[column] || ''}</div>
            ))}
           
          </div>
        ))}
      </div>

      {showInvoiceForm && (
        <div className="invoice-form-container">
          <h3>Invoice Form</h3>
          <div className="form-row">
            <label>
              Factory Details:
              <input type="text" value={formData.factoryDetails} readOnly />
            </label>
            <label>
              Factory Phone Number:
              <input type="text" value={formData.factoryPhoneNumber} readOnly />
            </label>
          </div>
          <div className="form-row">
            <label>
              Invoice Number:
              <input type="text" value={formData.invoiceNumber} readOnly />
            </label>
            <label>
              Invoice To:
              <input type="text" value={formData.invoiceTo} onChange={e => handleFormDataChange('invoiceTo', e.target.value)} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Customer Address:
              <input type="text" value={formData.customerAddress} onChange={e => handleFormDataChange('customerAddress', e.target.value)} />
            </label>
            <label>
              Date Issued:
              <input type="date" value={formData.dateIssued} onChange={e => handleFormDataChange('dateIssued', e.target.value)} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Due Date:
              <input type="date" value={formData.dueDate} onChange={e => handleFormDataChange('dueDate', e.target.value)} />
            </label>
          </div>

          <h4>Items</h4>
          <div className="items-table">
            <div className="table-header">
              <div className="header-cell">Item</div>
              <div className="header-cell">Cost</div>
              <div className="header-cell">Quantity</div>
              <div className="header-cell">Price</div>
            </div>
            {items.map((item, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">
                  <input type="text" value={item.item} onChange={e => handleItemChange(index, 'item', e.target.value)} />
                </div>
                <div className="table-cell">
                  <input type="number" value={item.cost} onChange={e => handleItemChange(index, 'cost', e.target.value)} />
                </div>
                <div className="table-cell">
                  <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
                </div>
                <div className="table-cell">
                  <input type="number" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddItem} className="action-button">Add Item</button>

          <div className="form-row">
            <label>
              Sales Person:
              <input type="text" value={formData.salesPerson} onChange={e => handleFormDataChange('salesPerson', e.target.value)} />
            </label>
            <label>
              Greeting:
              <input type="text" value={formData.greeting} readOnly />
            </label>
          </div>
          <div className="form-row">
            <label>
              Subtotal:
              <input type="number" value={formData.subtotal} readOnly />
            </label>
            <label>
              Discount:
              <input type="number" value={formData.discount} onChange={e => handleFormDataChange('discount', parseFloat(e.target.value) || 0)} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Tax:
              <input type="number" value={formData.tax} onChange={e => handleFormDataChange('tax', parseFloat(e.target.value) || 0)} />
            </label>
            <label>
              Total:
              <input type="number" value={formData.total} readOnly />
            </label>
          </div>

          <button onClick={handleGenerateInvoice} className="action-button">Generate Invoice</button>
        </div>
      )}
    </div>
  );
};

export default SOrders;
