import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

export default function SalesReport() {
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  useEffect(() => {
    if (selectedDate) {
      axios
        .get(`${API_BASE_URL}/api/today_sales`, {
          params: { date: selectedDate },
        })
        .then((res) => setDaily(res.data))
        .catch((err) => console.error("Daily sales fetch error", err));
    }
  }, [selectedDate]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/report_overview`)
      .then((res) => setOverview(res.data))
      .catch((err) => console.error("Overview fetch error", err));

    axios
      .get(`${API_BASE_URL}/api/monthly_Sales`)
      .then((res) => setMonthly(res.data.monthly_sales || []))
      .catch((err) => console.error("Monthly sales fetch error", err));
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Simple Header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Restaurant POS - Sales Report", 20, y);
    
    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    doc.text(`Generated: ${currentDate} ${currentTime}`, 20, y + 10);
    
    // Divider line
    doc.setLineWidth(0.5);
    doc.line(20, y + 15, 190, y + 15);
    
    y += 30;

    // Overview Section - Table Format
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Sales Overview", 20, y);
    
    y += 15;
    
    // Overview Table Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Metric", 20, y);
    doc.text("Value", 120, y);
    
    // Header line
    doc.setLineWidth(0.3);
    doc.line(20, y + 2, 190, y + 2);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    
    // Overview Table Data
    const overviewData = [
      ["Total Sales", `${parseFloat(overview.totalSales).toFixed(2)} ৳`],
      ["Total Orders", overview.totalOrder],
      ["Average Order", `${parseFloat(overview.averageOrder).toFixed(2)} ৳`],
      ["Top Item", overview.topItem?.name || "N/A"]
    ];
    
    overviewData.forEach((row) => {
      doc.text(row[0], 20, y);
      doc.text(row[1].toString(), 120, y);
      y += 8;
    });
    
    y += 15;

    // Daily Sales Section - Table Format
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Daily Sales Summary", 20, y);
    
    y += 15;
    
    // Daily Sales Table Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Metric", 20, y);
    doc.text("Value", 120, y);
    
    // Header line
    doc.setLineWidth(0.3);
    doc.line(20, y + 2, 190, y + 2);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    
    // Daily Sales Table Data
    const dailyData = [
      ["Date", selectedDate],
      ["Sales", `${parseFloat(daily.sales).toFixed(2)} ৳`],
      ["Orders", daily.orders],
      ["Top Item", daily.top_item || "N/A"]
    ];
    
    dailyData.forEach((row) => {
      doc.text(row[0], 20, y);
      doc.text(row[1].toString(), 120, y);
      y += 8;
    });
    
    y += 15;

    // Monthly Sales Section - Table Format
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Sales Report", 20, y);
    
    y += 15;

    // Monthly Sales Table Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Month", 20, y);
    doc.text("Total Orders", 80, y);
    doc.text("Total Sales (৳)", 140, y);
    
    // Header line
    doc.setLineWidth(0.3);
    doc.line(20, y + 2, 190, y + 2);
    
    y += 10;

    // Monthly data
    doc.setFont("helvetica", "normal");
    
    monthly.forEach((month, index) => {
      if (y > 270) { // New page if needed
        doc.addPage();
        y = 20;
        
        // Repeat header
        doc.setFont("helvetica", "bold");
        doc.text("Month", 20, y);
        doc.text("Total Orders", 80, y);
        doc.text("Total Sales (৳)", 140, y);
        doc.line(20, y + 2, 190, y + 2);
        y += 10;
        doc.setFont("helvetica", "normal");
      }
      
      doc.text(month.month, 20, y);
      doc.text(month.total_orders.toString(), 80, y);
      doc.text(parseFloat(month.total_sales).toFixed(2), 140, y);
      
      y += 8;
    });

    // Simple footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 20, 285);
      doc.text("Restaurant POS System", 160, 285);
    }

    // Save the file
    doc.save(`Sales_Report_${selectedDate}.pdf`);
  };

  if (!overview || !daily || !monthly) {
    return <p className="text-center mt-5">Loading reports...</p>;
  }

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{ backgroundColor: "#f4f7fc", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">📊 Reports Overview</h2>
        <button
          className="btn btn-outline-danger ms-2"
          onClick={handleExportPDF}
        >
          <i className="bi bi-file-earmark-pdf me-2"></i>Export as PDF
        </button>
      </div>

      {/* Overview Cards */}
      <div className="row g-4 mb-5">
        {[
          {
            title: "Total Sales",
            value: `${parseFloat(overview.totalSales).toFixed(2)} ৳`,
            color: "success",
            icon: "bi-currency-dollar",
          },
          {
            title: "Total Orders",
            value: overview.totalOrder,
            color: "primary",
            icon: "bi-cart-check",
          },
          {
            title: "Average Order",
            value: `${parseFloat(overview.averageOrder).toFixed(2)} ৳`,
            color: "warning",
            icon: "bi-graph-up",
          },
          {
            title: "Top Item",
            value: `${overview.topItem?.name || "N/A"} (${
              overview.topItem?.total_qty || 0
            })`,
            color: "dark",
            icon: "bi-star-fill",
          },
        ].map((card, i) => (
          <div className="col-md-3" key={i}>
            <div
              className={`card border-start border-${card.color} border-4 shadow-sm bg-white`}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <i
                    className={`bi ${card.icon} me-2 fs-4 text-${card.color}`}
                  ></i>
                  <h6 className="text-muted mb-0">{card.title}</h6>
                </div>
                <h4 className={`fw-bold text-${card.color}`}>{card.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Sales */}
      <div className="bg-white p-4 rounded shadow-sm mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-secondary">📅 Daily Sales Summary</h4>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ maxWidth: "200px" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="row g-4">
          {[
            {
              title: `Sales on ${selectedDate}`,
              value: `${parseFloat(daily.sales).toFixed(2)} ৳`,
              icon: "bi-cash-coin",
              color: "success",
            },
            {
              title: "Total Orders",
              value: daily.orders,
              icon: "bi-receipt",
              color: "primary",
            },
            {
              title: "Top Item",
              value: daily.top_item
                ? `${daily.top_item} (${daily.top_item_qty})`
                : "N/A",
              icon: "bi-star",
              color: "warning",
            },
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <div className="card border-0 shadow h-100 bg-light">
                <div className="card-body text-center">
                  <i
                    className={`bi ${item.icon} fs-2 text-${item.color} mb-3`}
                  ></i>
                  <h6 className="text-muted mb-1">{item.title}</h6>
                  <h4 className={`fw-bold text-${item.color}`}>{item.value}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Sales Table */}
      <h4 className="text-secondary mb-3">📆 Monthly Sales Report</h4>
      <div className="table-responsive shadow-sm rounded bg-white p-2">
        <table className="table table-bordered table-hover align-middle">
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