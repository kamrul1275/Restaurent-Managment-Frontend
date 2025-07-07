import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

export default function InvoicePage() {
  const { orderId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/invoice/${orderId}`)
      .then((response) => {
        setInvoiceData(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch invoice", error);
      });
  }, [orderId]);

  if (!invoiceData) return <p>Loading invoice...</p>;

  const { orderitems } = invoiceData;

  return (
    <div
      className="invoice-box"
      style={{
        maxWidth: "800px",
        margin: "auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Restaurant POS</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <p>Customer Name: {invoiceData.customer_name}</p>
            <p>Phone: {invoiceData.customer_phone}</p>
          </div>

          <div className="col-md-8">
            <p>Invoice #: {invoiceData.order_number}</p>
            <p>Date: {invoiceData.order_date}</p>
            <p>Order Type: {invoiceData.order_type}</p>
          </div>
        </div>
      </div>

      {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p>Invoice #: {invoiceData.order_number}</p>
        <p>Date: {invoiceData.order_date}</p>
        <p>Order Type: {invoiceData.order_type}</p>
      </div> */}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderitems.map((item, i) => (
            <tr key={i} style={{ textAlign: "center" }}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price} taka</td>
              <td>{item.quantity * parseFloat(item.price)} taka</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <p>Subtotal: {invoiceData.subtotal} taka</p>
        <p>Discount: {invoiceData.discount_percent}%</p>
        <p>Delivery Charge: {invoiceData.delivery_charge} taka</p>
        <h3>Total: {invoiceData.total_amount} taka</h3>
        <p>Paid via: {invoiceData.payment_method}</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <p>Thank you for dining with us!</p>
        <p>Contact: +880 1307450464 | Visit Again!</p>
        <button
          onClick={() => window.print()}
          style={{
            background: "#27ae60",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            margin: "5px",
          }}
        >
          🖨️ Print Invoice
        </button>
        <Link
          href="/"
          style={{
            background: "#2980b9",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
          }}
        >
          ➕ New Order
        </Link>
      </div>
    </div>
  );
}
