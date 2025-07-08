import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

//  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://restaurent-pos.test';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

// export default function Dashboard() {
export default function Dashboard({ setIsAuthenticated }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [menuItems, setMenuItems] = useState([]);

  //order

  const location = useLocation();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const deliveryCharge = 0;



  // ✅ Declare here only once
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + deliveryCharge;

  // add order
  const addToOrder = (item) => {
    const existing = orderItems.find((i) => i.id === item.id);
    if (existing) {
      setOrderItems(
        orderItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const incrementQty = (itemId) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (itemId) => {
    setOrderItems(
      orderItems.flatMap((item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return []; // remove if quantity becomes 0
          }
        }
        return item;
      })
    );
  };

  const removeItem = (itemId) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  //invoice generate

  const handleCheckout = async () => {
    try {
      const payload = {
        customer_name: customerName, // you can make it dynamic
        customer_phone: customerPhone, // you can make it dynamic
        subtotal: subtotal,
        discount_percent: discount,
        total_amount: total,
        payment_method: "Cash", // or dynamic value
        order_type: "takeaway", // or dine_in, delivery, etc.
        notes: "oky",
        orderitems: orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/create_orders`,
        payload
      );

      if (response.data && response.data.data?.id) {
        const orderId = response.data.data.id;

        // ✅ Open invoice view
        const newTab = window.open(`/dashboard/invoice/${orderId}`, "_blank");
        if (newTab) newTab.focus();
      } else {
        alert("Order created but no ID returned.");
      }
    } catch (error) {
      console.error("Error creating order:", error);

      // Optional: Show validation errors
      if (error.response?.data?.errors) {
        const errs = error.response.data.errors;
        let msg = "Validation Errors:\n";
        Object.keys(errs).forEach((key) => {
          msg += `${key}: ${errs[key].join(", ")}\n`;
        });
        alert(msg);
      } else {
        alert("Something went wrong while creating the order.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/api/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ✅ This will update the state in AppRoutes and re-render the login page
      setIsAuthenticated(false);

      // Optional: navigate to login page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.menu_category?.name === activeCategory);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/menu_categories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/api/menu_items`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Set only the data array
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const fullImagePath = (imagePath) => {
    return `${API_BASE_URL}/storage/${imagePath}`; // Ensure storage symlink is created
  };

  const isDefaultDashboard = location.pathname === "/dashboard";

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h4">🍽️ Restaurant POS</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              Welcome,{" "}
              {JSON.parse(localStorage.getItem("user"))?.name || "Admin"}
            </span>
            <button className="btn btn-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 sidebar py-4">
          <nav className="nav flex-column">
            <Link className="nav-link" to="/dashboard">
              POS
            </Link>
            {/* <Link className="nav-link" to="/dashboard/orders">Orders</Link> */}
            <Link className="nav-link" to="/dashboard/orders_history">
              Orders History
            </Link>
            {/* <Link className="nav-link" to="/dashboard/tables">Tables</Link> */}
            <Link className="nav-link" to="/dashboard/menu-items">
              Menu
            </Link>
            <Link className="nav-link" to="/dashboard/sales_report">
              Reports
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-md-10 py-4">
          {isDefaultDashboard ? (
            <div className="row">
              {/* Order Types */}
              <div className="col-md-8">
                {/* <div className="btn-group mb-3" role="group">
                  <button
                    type="button"
                    className="btn btn-outline-primary active"
                  >
                    Dine In
                  </button>
                  <button type="button" className="btn btn-outline-primary">
                    Takeaway
                  </button>
                  <button type="button" className="btn btn-outline-primary">
                    Delivery
                  </button>
                </div> */}

                {/* Category Filters */}
                <div className="menu-category mb-3">
                  <button
                    className={`btn btn-outline-secondary me-2 ${
                      activeCategory === "All" ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory("All")}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`btn btn-outline-secondary me-2 ${
                        activeCategory === category.name ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Menu Items */}
<div className="row">
  {filteredItems.map((item) => (
    <div className="col-md-4 mb-3" key={item.id}>
      <div className="card card-menu-item text-center h-100">
        <img
          src={fullImagePath(item.image)}
          className="menu-image"
          alt={item.name}
        />
        <div className="card-content">
          <h6 className="mb-1">{item.name}</h6>
          <p className="text-muted mb-1">
            {parseFloat(item.price).toFixed(2)} taka
          </p>
          <small className="text-muted">{item.menu_category?.name}</small>
        </div>
        <button
          className="btn btn-sm btn-success text-white mt-3"
          onClick={() => addToOrder(item)}
        >
          <i className="bi bi-plus-circle me-1"></i> Add
        </button>
      </div>
    </div>
  ))}
</div>

              </div>

              {/* Order Summary */}
              <div className="col-md-4">
                <div className="order-summary">
                  <h5>
                    <i className="bi bi-cart"></i> Current Order
                  </h5>
                  <hr />



                  <ul className="list-group mb-3">
                    {orderItems.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{item.name}</strong> <br />
                          <div className="btn-group btn-group-sm mt-1">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => decrementQty(item.id)}
                            >
                              -
                            </button>
                            <span className="btn btn-light disabled">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => incrementQty(item.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-end">
                          <div>{(item.price * item.quantity).toFixed(2)} ৳</div>
                          <button
                            className="btn btn-sm btn-danger mt-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-3">
                    <label htmlFor="customerName" className="form-label">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="customerPhone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <p>
                    Subtotal:{" "}
                    <strong className="subtotal">
                      {subtotal.toFixed(2)} taka
                    </strong>
                  </p>

                  <p>
                    Discount:
                    <input
                      type="number"
                      className="form-control form-control-sm d-inline w-50 ms-2"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />{" "}
                    %
                  </p>

                  <p>
                    Delivery: <strong>{deliveryCharge.toFixed(2)} taka</strong>
                  </p>

                  <h5>
                    Total:{" "}
                    <strong className="total">{total.toFixed(2)} taka</strong>
                  </h5>

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-checkout"
                      onClick={handleCheckout}
                    >
                      💳 Checkout
                    </button>

                    <button
                      className="btn btn-clear"
                      onClick={() => {
                        setOrderItems([]);
                        setDiscount(0);
                      }}
                    >
                      🗑️ Clear Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}
