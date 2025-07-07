import React, { useState, useRef, useEffect } from "react";

const initialMenuItems = [
  {
    id: 1,
    name: "Chicken Burger",
    price: 5.0,
    image: "https://i.imgur.com/JZxjWFl.png",
    category: "main-course",
    description: "Delicious chicken burger",
    status: "available",
  },
  {
    id: 2,
    name: "French Fries",
    price: 3.0,
    image: "https://i.imgur.com/cA8zoG6.png",
    category: "appetizers",
    description: "Crispy golden fries",
    status: "available",
  },
  {
    id: 3,
    name: "Mango Juice",
    price: 2.5,
    image: "https://i.imgur.com/G7KzQST.png",
    category: "beverages",
    description: "Fresh mango juice",
    status: "available",
  },
];

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    status: "available",
    description: "",
    image: null,
  });

  const imageInputRef = useRef(null);

  // Show toast for 3 seconds when toastMessage changes
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle form input change
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleUploadAreaClick() {
    if (imageInputRef.current) imageInputRef.current.click();
  }

  function handleUploadDragOver(e) {
    e.preventDefault();
  }

  function handleUploadDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
      e.dataTransfer.clearData();
    }
  }

  function resetForm() {
    setForm({
      name: "",
      price: "",
      category: "",
      status: "available",
      description: "",
      image: null,
    });
    setImagePreview(null);
  }

  function handleAddMenuItem() {
    if (!form.name.trim() || !form.price || !form.category) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category,
      description: form.description.trim(),
      status: form.status,
      image: imagePreview || "https://via.placeholder.com/300x200?text=No+Image",
    };

    setMenuItems((prev) => [...prev, newItem]);
    setShowModal(false);
    resetForm();
    setToastMessage("Menu item added successfully!");
  }

  function handleDeleteMenuItem(id) {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      setToastMessage("Menu item deleted successfully!");
    }
  }

  return (
    <>


      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}


          {/* Main Content */}
          <div className="col-md-10 menu-container" style={{ padding: 30 }}>
            <div className="menu-header d-flex justify-content-between align-items-center" style={{ marginBottom: 25 }}>
              <h3>Menu Items</h3>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                ➕ Add New Item
              </button>
            </div>

            <div className="row g-4" id="menuItemsContainer">
              {menuItems.map((item) => (
                <div className="col-md-4" key={item.id}>
                  <div
                    className="card-menu-item"
                    style={{
                      background: "white",
                      borderRadius: 10,
                      boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                      padding: 20,
                      transition: "0.3s",
                      textAlign: "center",
                      cursor: "pointer",
                      marginBottom: "1rem",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ height: 100, objectFit: "cover", marginBottom: 10, borderRadius: 8 }}
                    />
                    <h5 style={{ fontWeight: 600, color: "#2c3e50" }}>{item.name}</h5>
                    <p style={{ fontSize: 14, color: "#7f8c8d" }}>${item.price.toFixed(2)}</p>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm" style={{ backgroundColor: "#134e89", color: "white" }}>
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#e74c3c", color: "white" }}
                        onClick={() => handleDeleteMenuItem(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#2c3e50", color: "white" }}
              >
                <h5 className="modal-title">➕ Add New Menu Item</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  aria-label="Close"
                  style={{ filter: "invert(1)" }}
                ></button>
              </div>
              <div className="modal-body">
                <form id="addMenuItemForm" onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="itemName" className="form-label" style={{ fontWeight: 600, color: "#2c3e50" }}>
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="itemName"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="itemPrice" className="form-label" style={{ fontWeight: 600, color: "#2c3e50" }}>
                        Price ($)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="itemPrice"
                        name="price"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="itemCategory" className="form-label" style={{ fontWeight: 600, color: "#2c3e50" }}>
                        Category
                      </label>
                      <select
                        className="form-select"
                        id="itemCategory"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="appetizers">Appetizers</option>
                        <option value="main-course">Main Course</option>
                        <option value="desserts">Desserts</option>
                        <option value="beverages">Beverages</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="itemStatus" className="form-label" style={{ fontWeight: 600, color: "#2c3e50" }}>
                        Status
                      </label>
                      <select
                        className="form-select"
                        id="itemStatus"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="itemDescription" className="form-label" style={{ fontWeight: 600, color: "#2c3e50" }}>
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="itemDescription"
                      name="description"
                      rows="3"
                      placeholder="Enter item description..."
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div
                    className={`upload-area${imagePreview ? " dragover" : ""}`}
                    onClick={handleUploadAreaClick}
                    onDragOver={handleUploadDragOver}
                    onDrop={handleUploadDrop}
                    style={{
                      border: "2px dashed #134e89",
                      borderRadius: 8,
                      padding: 20,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: imagePreview ? "#e3f2fd" : "transparent",
                    }}
                  >
                    <input
                      type="file"
                      id="imageUpload"
                      name="image"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={imageInputRef}
                      onChange={handleChange}
                    />
                    {!imagePreview && (
                      <div id="uploadText">
                        <i className="bi bi-cloud-upload" style={{ fontSize: "2rem", color: "#134e89" }}></i>
                        <p className="mb-0">Click to upload or drag and drop image</p>
                        <small className="text-muted">PNG, JPG, GIF up to 5MB</small>
                      </div>
                    )}
                    {imagePreview && (
                      <img
                        id="imagePreview"
                        className="image-preview"
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, marginTop: 10 }}
                      />
                    )}
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddMenuItem}>
                  Save Menu Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setToastMessage("")}
              ></button>
            </div>
            <div className="toast-body">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Inline styles from your original CSS (add to your global CSS for better practice) */}
      <style>{`

        .btn-edit {
          background-color: #134e89;
          color: white;
        }
        .btn-delete {
          background-color: #e74c3c;
          color: white;
        }
      `}</style>
    </>
  );
}
