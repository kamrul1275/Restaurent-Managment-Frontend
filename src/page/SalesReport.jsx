
import React from 'react';

export default function SalesReport() {
  return (
    <div className="col-md-10 report-container px-4 py-3">
      {/* Page Header */}
      <div className="report-header d-flex justify-content-between align-items-center mb-4">
        <h3>Reports Overview</h3>
        <button className="btn btn-export">📥 Export All</button>
      </div>

      {/* Total Sales Overview */}
      <div className="row g-4 mb-4">
        {[
          { title: 'Total Sales', value: '$12,420.00' },
          { title: 'Total Orders', value: '967', className: 'text-primary' },
          { title: 'Average Order', value: '$12.85' },
          { title: 'Top Item', value: 'Chicken Burger', className: 'text-dark' },
        ].map((item, index) => (
          <div className="col-md-3" key={index}>
            <div className="summary-card">
              <h6>{item.title}</h6>
              <div className={`value ${item.className || ''}`}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Sales Report */}
      <h4 className="section-title">📅 Daily Sales Report</h4>
      <div className="report-summary row text-center mb-4">
        <div className="col-md-4">
          <h5>Today's Sales</h5>
          <p className="fs-4 text-success">$180.00</p>
        </div>
        <div className="col-md-4">
          <h5>Today's Orders</h5>
          <p className="fs-4 text-primary">18</p>
        </div>
        <div className="col-md-4">
          <h5>Top Item</h5>
          <p className="fs-5">French Fries</p>
        </div>
      </div>

      <div className="table-responsive mb-5">
        <table className="table report-table table-bordered">
          <thead>
            <tr>
              <th>Time</th>
              <th>Invoice #</th>
              <th>Order Type</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>11:20 AM</td>
              <td>INV-2001</td>
              <td>Dine In</td>
              <td>$25.00</td>
              <td>$30.00</td>
              <td>$5.00</td>
            </tr>
            <tr>
              <td>01:45 PM</td>
              <td>INV-2002</td>
              <td>Takeaway</td>
              <td>$15.00</td>
              <td>$20.00</td>
              <td>$5.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Monthly Sales Report */}
      <h4 className="section-title">📊 Monthly Sales Report</h4>
      <div className="report-summary row text-center mb-4">
        <div className="col-md-4">
          <h5>This Month's Sales</h5>
          <p className="fs-4 text-success">$4,750.00</p>
        </div>
        <div className="col-md-4">
          <h5>Total Orders</h5>
          <p className="fs-4 text-primary">362</p>
        </div>
        <div className="col-md-4">
          <h5>Best Selling Item</h5>
          <p className="fs-5">Chicken Burger</p>
        </div>
      </div>

      <div className="table-responsive mb-5">
        <table className="table report-table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Total Sales</th>
              <th>Paid</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-06-24</td>
              <td>45</td>
              <td>$500.00</td>
              <td>$520.00</td>
              <td>$20.00</td>
            </tr>
            <tr>
              <td>2025-06-23</td>
              <td>38</td>
              <td>$420.00</td>
              <td>$430.00</td>
              <td>$10.00</td>
            </tr>
            <tr>
              <td>2025-06-22</td>
              <td>62</td>
              <td>$330.00</td>
              <td>$350.00</td>
              <td>$20.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
