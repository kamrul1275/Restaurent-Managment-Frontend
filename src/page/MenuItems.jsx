import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://restaurent-pos.test";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    menu_category_id: "",
    description: "",
    image: null,
  });

  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  function fetchCategories() {
    axios
      .get(`${API_BASE_URL}/api/menu_categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }

  function fetchMenuItems() {
    axios
      .get(`${API_BASE_URL}/api/menu_items`)
      .then((res) => setMenuItems(res.data.data))
      .catch((err) => console.error("Error fetching menu items:", err));
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function resetForm() {
    setForm({ name: "", price: "", menu_category_id: "", description: "", image: null });
    setImagePreview(null);
    setEditId(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleAddOrUpdateMenuItem() {
    if (!form.name.trim() || !form.price || !form.menu_category_id) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("menu_category_id", form.menu_category_id);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    const url = editId
      ? `${API_BASE_URL}/api/update_menu_items/${editId}`
      : `${API_BASE_URL}/api/create_menu_items`;

    axios
      .post(url, formData)
      .then(() => {
        setToastMessage(editId ? "Item updated successfully!" : "Item added successfully!");
        setShowModal(false);
        resetForm();
        fetchMenuItems();
      })
      .catch((err) => {
        console.error("Submit failed:", err);
        alert("Something went wrong");
      });
  }

  function handleEdit(item) {
    setForm({
      name: item.name,
      price: item.price,
      menu_category_id: item.menu_category_id,
      description: item.description,
      image: null,
    });
    setImagePreview(`${API_BASE_URL}/storage/${item.image}`);
    setEditId(item.id);
    setShowModal(true);
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    axios
      .delete(`${API_BASE_URL}/api/delete_menu_items/${id}`)
      .then(() => {
        setToastMessage("Item deleted successfully!");
        fetchMenuItems();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete item.");
      });
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Menu Items</h3>
        <button className="btn btn-success" onClick={() => { setShowModal(true); resetForm(); }}>
          ➕ Add New Item
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="alert alert-success" role="alert">
          {toastMessage}
        </div>
      )}

      {/* Menu Items Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.menu_category?.name}</td>
                <td>{item.price}</td>
                <td>{item.description}</td>
                <td>
                  {item.image && (
                    <img
                      src={`${API_BASE_URL}/storage/${item.image}`}
                      alt={item.name}
                      style={{ height: 50 }}
                    />
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">{editId ? "Edit Menu Item" : "Add New Menu Item"}</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="menu_category_id"
                      value={form.menu_category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleChange}
                      ref={imageInputRef}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2"
                        style={{ maxHeight: 150 }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddOrUpdateMenuItem}>
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
