import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GiftDetails.css";

function GiftDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch gift details
  useEffect(() => {
    const fetchGift = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/gifts/${id}`);
        setGift(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGift();
  }, [id]);

  // Check if gift is already in cart
  useEffect(() => {
    const checkCart = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:8080/cart/${userId}`);
        const inCart = res.data.some(item => item.giftId === parseInt(id));
        if (inCart) setAdded(true);
      } catch (err) {
        console.error(err);
      }
    };
    checkCart();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in before adding items to the cart.");
        return;
      }

      setAdding(true);

      await axios.post("http://localhost:8080/cart/add", {
        giftId: gift.id,
        quantity: 1,
        userId,
      });

      setAdded(true);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Error adding to cart. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteGift = async () => {
  try {
    await axios.delete(`http://localhost:8080/gifts/delete/${gift.id}`);
    setSuccess(true); // reuse success message area
    setTimeout(() => {
      navigate("/productslist"); // redirect to product list
    }, 2000);
  } catch (err) {
    console.error(err);
    alert("Error deleting gift. Try again.");
  }
};

  if (loading) return <p>Loading gift details...</p>;
  if (!gift) return <p>Gift not found.</p>;

  return (
    <div className="gift-details-container">
      {/* Top button group */}
      <div className="button-group">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back to Gifts
        </button>

        {added ? (
          <button className="go-cart-btn" onClick={() => navigate("/cart")}>
            Go to Cart
          </button>
        ) : (
          <button className="add-btn" onClick={handleAddToCart} disabled={adding}>
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        )}
        {/* ✅ Edit Gift Button */}
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-gift/${gift.id}`);
          }}
        >
         Edit Gift
        </button>

        {/* ✅ Delete Gift Button */}
        <button className="delete-btn" onClick={handleDeleteGift}> Delete Gift</button>
      </div>

      {/* Main content */}
      <div className="gift-content">
        <div className="gift-details-left">
          <img src={gift.imageUrl} alt={gift.name} className="gift-details-image" />
        </div>

        <div className="gift-details-right">
          <h2>{gift.name}</h2>
          <p>{gift.description}</p>
          <strong>Price: ₹{gift.price}</strong>

          {success && (
            <div className="success-message">
              {added ? "Added to cart!" : "Gift deleted successfully!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GiftDetails;
