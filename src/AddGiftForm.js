import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddGiftForm.css"; // 👈 import the CSS

function AddGiftForm() {
  const [gift, setGift] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    imageUrl: ""
  });
  const [successMessage, setSuccessMessage] = useState(""); // ✅ message state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGift({ ...gift, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/gifts/addgift", gift);
      setSuccessMessage("Gift added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000); // ✅ hide after 2 sec
      console.log(res.data);
      setGift({ name: "", category: "", description: "", price: "", imageUrl: "" });
      navigate("/productslist"); // redirect to product list page after success
    } catch (error) {
      console.error(error);
      setSuccessMessage("Error adding gift!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  return (
    <div className="add-gift-page">
      <div className="add-gift-card">
        {/* ✅ success message display */}
        {successMessage && <div className="success-msg">{successMessage}</div>}
        
        <h2>Add New Gift</h2>
        <form onSubmit={handleSubmit} className="add-gift-form">
          <input
            name="name"
            placeholder="Gift Name"
            value={gift.name}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={gift.category}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={gift.description}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={gift.price}
            onChange={handleChange}
          />
          <input
            name="imageUrl"
            placeholder="Image URL"
            value={gift.imageUrl}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">Add Gift</button>
        </form>

        <button className="back-btn" onClick={() => navigate("/productslist")}>
          ← Back to Products
        </button>
      </div>
    </div>
  );
}

export default AddGiftForm;
