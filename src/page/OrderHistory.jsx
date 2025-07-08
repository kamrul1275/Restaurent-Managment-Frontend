import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [orderType, setOrderType] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/orders`)
      .then((res) => {
        setOrders(res.data.data || res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
      });
  }, []);

  const handleView = (orderId) => {
    navigate(`/dashboard/invoice/${orderId}`);
  };

  // Filter orders based on search criteria
  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();
    const invoiceMatch = order.order_number?.toLowerCase().includes(searchLower);
    const tableMatch = (order.table_no || '').toLowerCase().includes(searchLower);
    const dateMatch = !date || order.order_date?.startsWith(date);
    const typeMatch = !orderType || order.order_type === orderType;

    return (invoiceMatch || tableMatch) && dateMatch && typeMatch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, date, orderType]);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
        
        {/* Items per page selector */}
        <div className="items-per-page">
          <label>Show: </label>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span> entries</span>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        <p>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} entries
          {filteredOrders.length !== orders.length && ` (filtered from ${orders.length} total entries)`}
        </p>
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
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
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
                    onClick={() => handleView(order.id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {generatePageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination info */}
      {totalPages > 1 && (
        <div className="pagination-info">
          <p>Page {currentPage} of {totalPages}</p>
        </div>
      )}

      <style jsx>{`
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          align-items: center;
        }

        .items-per-page {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .items-per-page select {
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .results-info {
          margin-bottom: 10px;
        }

        .results-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
        }

        .pagination-btn:hover:not(:disabled):not(.disabled) {
          background: #f5f5f5;
          border-color: #999;
        }

        .pagination-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination-btn:disabled,
        .pagination-btn.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-info {
          text-align: center;
          margin-top: 10px;
        }

        .pagination-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .pagination {
            justify-content: center;
          }
          
          .pagination-btn {
            padding: 6px 10px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}