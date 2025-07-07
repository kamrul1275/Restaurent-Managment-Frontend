import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

export default function SalesReport() {
  const [overview, setOverview] = useState(null);
  const [today, setToday] = useState(null);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/report_overview`)
      .then(res => setOverview(res.data))
      .catch(err => console.error("Overview fetch error", err));

    axios.get(`${API_BASE_URL}/api/today_sales`)
      .then(res => setToday(res.data))
      .catch(err => console.error("Today sales fetch error", err));

    axios.get(`${API_BASE_URL}/api/monthly_Sales`)
      .then(res => setMonthly(res.data.monthly_sales || []))
      .catch(err => console.error("Monthly sales fetch error", err));
  }, []);

  if (!overview || !today || !monthly) return <p className="text-center mt-5">Loading reports...</p>;

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📊 Reports Overview</h2>
        <button className="btn btn-outline-primary">📥 Export Report</button>
      </div>

      {/* Overview Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-start border-success border-4 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Sales</h6>
              <h4 className="text-success fw-bold">{parseFloat(overview.totalSales).toFixed(2)} ৳</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-start border-primary border-4 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Orders</h6>
              <h4 className="text-primary fw-bold">{overview.totalOrder}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-start border-warning border-4 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Average Order</h6>
              <h4 className="text-warning fw-bold">{parseFloat(overview.averageOrder).toFixed(2)} ৳</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-start border-dark border-4 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Top Item</h6>
              <h5 className="text-dark fw-bold">
                {overview.topItem?.name || 'N/A'} <small className="text-muted">({overview.topItem?.total_qty || 0})</small>
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* Today Sales */}
      <h4 className="text-secondary mb-3">📅 Today’s Summary</h4>
      <div className="row text-center mb-5">
        <div className="col-md-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h6>Today’s Sales</h6>
            <h4 className="text-success">{parseFloat(today.today_sales).toFixed(2)} ৳</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h6>Today’s Orders</h6>
            <h4 className="text-primary">{today.today_orders}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h6>Top Item Today</h6>
            <h5>{today.top_item} ({today.top_item_qty})</h5>
          </div>
        </div>
      </div>

      {/* Monthly Sales Table */}
      <h4 className="text-secondary mb-3">📆 Monthly Sales Report</h4>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>Month</th>
              <th>Total Orders</th>
              <th>Total Sales (৳)</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {monthly.map((month, i) => (
              <tr key={i}>
                <td>{month.month}</td>
                <td>{month.total_orders}</td>
                <td>{parseFloat(month.total_sales).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
