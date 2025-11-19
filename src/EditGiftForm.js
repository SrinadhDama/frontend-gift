import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./AddGiftForm.css"; // reuse same CSS

function EditGiftForm() {
  const { id } = useParams();
  const [gift, setGift] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    imageUrl: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/gifts/${id}`);
        setGift(res.data);
      } catch (err) {
        console.error("Error fetching gift:", err);
      }
    };
    fetchGift();
  }, [id]);

  const handleChange = (e) => {
    setGift({ ...gift, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/gifts/update/${id}`, gift);
      setMessage("✅ Gift updated successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/productslist"); // Go back to list after update
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update gift");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  return (
    <div className="add-gift-page">
      <div className="add-gift-card">
        <h2>Edit Gift</h2>
        {message && <div className="success-msg">{message}</div>}

        <form onSubmit={handleSubmit} className="add-gift-form">
          <input name="name" value={gift.name} onChange={handleChange} />
          <input name="category" value={gift.category} onChange={handleChange} />
          <textarea name="description" value={gift.description} onChange={handleChange} />
          <input name="price" type="number" value={gift.price} onChange={handleChange} />
          <input name="imageUrl" value={gift.imageUrl} onChange={handleChange} />

          <button type="submit" className="submit-btn">Update Gift</button>
        </form>

        <button className="back-btn" onClick={() => navigate("/productslist")}>
          ← Back to Products
        </button>
      </div>
    </div>
  );
}

export default EditGiftForm;
