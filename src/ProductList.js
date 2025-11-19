import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "./ProductList.css";

const ProductList = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // <-- search term state

  const navigate = useNavigate();

  // Fetch gifts
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/gifts/allgifts");
        setGifts(response.data);
      } catch (err) {
        console.error("Error fetching gifts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  if (loading) return <p>Loading gifts...</p>;

  // Filter gifts based on search term
  const filteredGifts = gifts.filter((gift) =>
    gift.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="product-page">
      {/* Pass searchTerm to Header via onSearch prop */}
      <Header onSearch={(term) => setSearchTerm(term)} />

      <div style={{ marginTop: "80px" }} className="product-container">
        <h2 className="product-title">Available Gifts</h2>
        <button className="add-gift-btn" onClick={() => navigate("/add-gift")}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
                Add Gift
          </button>
        <div className="gift-grid">
          {filteredGifts.length > 0 ? (
            filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="gift-card"
              onClick={() => navigate(`/gift/${gift.id}`)}
            >
              <img src={gift.imageUrl} alt={gift.name} className="gift-image" />
              <h3>{gift.name}</h3>
              {/* <p>{gift.description}</p> */}
              <strong>Price: ₹{gift.price}</strong>
              <br />

              {/* {addedToCartIds.includes(gift.id) ? (
                <button
                  className="go-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/cart");
                  }}
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(gift);
                  }}
                  disabled={addingId === gift.id}
                >
                  {addingId === gift.id ? "Adding..." : "Add to Cart"}
                </button>
              )}

              {successId === gift.id && (
                <div className="success-message">Added to cart!</div> 
              )}    */}

            </div>
          ))
          ) : (
            <p>No gifts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
