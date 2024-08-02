import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './Sfirebase'; // Ensure you have the Firebase setup
import './SInvoice.css';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


const SInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, 'factory-invoice'));
      const invoicesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setInvoices(invoicesData);
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'factory-invoice', id));
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleClose = () => {
    setSelectedInvoice(null);
  };

  const handleDownload = () => {
    

    doc.text(`Invoice #${selectedInvoice.invoiceNumber}`, 10, 10);
    doc.text(`Date Issued: ${new Date(selectedInvoice.dateIssued).toLocaleDateString()}`, 10, 20);
    doc.text(`Date Due: ${new Date(selectedInvoice.dueDate).toLocaleDateString()}`, 10, 30);
    doc.text(`Invoice To: ${selectedInvoice.invoiceTo}`, 10, 40);
    doc.text(`Address: ${selectedInvoice.customerAddress}`, 10, 50);

    // Add table with item details
    doc.autoTable({
      startY: 60,
      head: [['Item', 'Cost', 'Qty', 'Price']],
      body: selectedInvoice.items.map(item => [item.item, item.cost, item.quantity, item.price]),
    });

    doc.text(`Subtotal: $${selectedInvoice.subtotal}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text(`Discount: $${selectedInvoice.discount}`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`Tax: $${selectedInvoice.tax}`, 10, doc.autoTable.previous.finalY + 30);
    doc.text(`Total: $${selectedInvoice.total}`, 10, doc.autoTable.previous.finalY + 40);

    doc.save(`Invoice_${selectedInvoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="invoice-container">
      <h1>Invoices</h1>
      <div className="invoice-table">
        <div className="table-header">
          <div className="header-cell">#</div>
          <div className="header-cell">Invoice Number</div>
          <div className="header-cell">Invoice To</div>
          <div className="header-cell">Customer Address</div>
          <div className="header-cell">Total</div>
          <div className="header-cell">Date Issued</div>
          <div className="header-cell">Due Date</div>
          <div className="header-cell">Actions</div>
        </div>
        {invoices.map((invoice, index) => (
          <div key={invoice.id} className="table-row">
            <div className="table-cell">{index + 1}</div>
            <div className="table-cell">{invoice.invoiceNumber}</div>
            <div className="table-cell">{invoice.invoiceTo}</div>
            <div className="table-cell">{invoice.customerAddress}</div>
            <div className="table-cell">₹{invoice.total}</div>
            <div className="table-cell">{new Date(invoice.dateIssued).toLocaleDateString()}</div>
            <div className="table-cell">{new Date(invoice.dueDate).toLocaleDateString()}</div>
            <div className="table-cell">
              <DeleteIcon onClick={() => handleDelete(invoice.id)} className="icon delete-icon" />
              <VisibilityIcon onClick={() => handleView(invoice)} className="icon view-icon" />
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedInvoice} onClose={handleClose}>
        <Box className="invoice-modal">
          {selectedInvoice && (
            <div className="invoice-card">
              <div className="invoice-header">
                <div className="invoice-company-details">
                  <h3>Flavour's Ocean</h3>
                  <p>4-140, Srinivasa Nagar Colony, Nallapadu</p>
                  <p>Nallapadu Rural, Andhra Pradesh-522002, INDIA</p>
                  <p>Tel: +91 1234567890</p>
                </div>
                <div className="invoice-number-details">
                  <p>Invoice #{selectedInvoice.invoiceNumber}</p>
                  <p>Date Issued: {new Date(selectedInvoice.dateIssued).toLocaleDateString()}</p>
                  <p>Date Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="invoice-body">
                <div className="invoice-address">
                  <div>
                    <strong>Invoice To:</strong>
                    <p>{selectedInvoice.invoiceTo}</p>
                    <p>{selectedInvoice.customerAddress}</p>
                    <p>{selectedInvoice.customerEmail}</p>
                  </div>
                </div>
                <div className="invoice-items">
                  <div className="items-table">
                    <div className="table-header">
                      <div className="header-cell">ITEM</div>
                      <div className="header-cell">COST</div>
                      <div className="header-cell">QTY</div>
                      <div className="header-cell">PRICE</div>
                    </div>
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className="table-row">
                        <div className="table-cell">{item.item}</div>
                        <div className="table-cell">{item.cost}</div>
                        <div className="table-cell">{item.quantity}</div>
                        <div className="table-cell">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="invoice-summary">
                  <p><strong>Salesperson:</strong> {selectedInvoice.salesPerson}</p>
                  <p>Thanks for your business</p>
                  <div className="invoice-totals">
                    <p><strong>Subtotal:</strong> ${selectedInvoice.subtotal}</p>
                    <p><strong>Discount:</strong> ${selectedInvoice.discount}</p>
                    <p><strong>Tax:</strong> ${selectedInvoice.tax}</p>
                    <p><strong>Total:</strong> ${selectedInvoice.total}</p>
                  </div>
                </div>
                
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default SInvoice;
