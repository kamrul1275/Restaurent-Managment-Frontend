import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [orderType, setOrderType] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/orders`)
      .then((res) => {
        setOrders(res.data.data || res.data); // Adjust depending on your API structure
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
      });
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();
    const invoiceMatch = order.order_number?.toLowerCase().includes(searchLower);
    const tableMatch = (order.table_no || '').toLowerCase().includes(searchLower);
    const dateMatch = !date || order.order_date?.startsWith(date);
    const typeMatch = !orderType || order.order_type === orderType;

    return (invoiceMatch || tableMatch) && dateMatch && typeMatch;
  });

  return (
    <div className="history-box">
      <h1>Order History</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Invoice # or Table No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Dine In">Dine In</option>
          <option value="Takeaway">Takeaway</option>
          <option value="Delivery">Delivery</option>
        </select>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Time</th>
            <th>Order Type</th>
            <th>Table No</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Change</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.order_date?.split('T')[0]}</td>
                <td>{new Date(order.order_date).toLocaleTimeString()}</td>
                <td>{order.order_type}</td>
                <td>{order.table_no || 'N/A'}</td>
                <td>{parseFloat(order.total_amount).toFixed(2)} Taka</td>
                <td>{parseFloat(order.total_amount).toFixed(2)} Taka</td>
                <td>0.00</td>
                <td className="actions">
                  <button
                    className="btn-view"
                    onClick={() => window.open(`/invoice/${order.id}`, '_blank')}
                  >
                    View
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => alert(`Delete order ${order.order_number}`)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
