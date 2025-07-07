import React, { useState } from 'react';

export default function OrderHistory() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [orderType, setOrderType] = useState('');

  // Dummy data for orders
  const orders = [
    {
      invoice: 'INV-1001',
      date: '2025-06-24',
      time: '03:30 PM',
      orderType: 'Dine In',
      tableNo: '5',
      total: 12.0,
      paid: 20.0,
      change: 8.0,
    },
    {
      invoice: 'INV-1002',
      date: '2025-06-23',
      time: '01:10 PM',
      orderType: 'Takeaway',
      tableNo: 'N/A',
      total: 8.5,
      paid: 10.0,
      change: 1.5,
    },
    // add more dummy orders here if needed
  ];

  // Filter orders based on search inputs
  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();
    const invoiceMatch = order.invoice.toLowerCase().includes(searchLower);
    const tableMatch = order.tableNo.toLowerCase().includes(searchLower);
    const dateMatch = !date || order.date === date;
    const typeMatch = !orderType || order.orderType === orderType;

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
              <tr key={order.invoice}>
                <td>{order.invoice}</td>
                <td>{order.date}</td>
                <td>{order.time}</td>
                <td>{order.orderType}</td>
                <td>{order.tableNo}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>${order.paid.toFixed(2)}</td>
                <td>${order.change.toFixed(2)}</td>
                <td className="actions">
                  <button
                    className="btn-view"
                    onClick={() => alert(`View invoice ${order.invoice}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => alert(`Delete invoice ${order.invoice}`)}
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
