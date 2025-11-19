import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [giftForm, setGiftForm] = useState({
    name: "",
    occasion: "",
    details: ""
  });
  const [generatedMessage, setGeneratedMessage] = useState("");
  const navigate = useNavigate();

  // Retrieve userId and username from localStorage
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username") || "Test User";
  const userEmail = localStorage.getItem("email") || "guest@example.com";
  const userPhone = localStorage.getItem("mobilenumber") || "9999999999";

  // Fetch cart items
  const fetchCart = useCallback(() => {
    if (!userId) {
      console.error("User ID not found in localStorage!");
      return;
    }
    axios
      .get(`http://localhost:8080/cart/get/${userId}`)
      .then((res) => {
        setCartItems(res.data);
        calculateTotal(res.data);
      })
      .catch((err) => console.error("Failed to load cart:", err));
  }, [userId]);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const calculateTotal = (items) => {
    //reduce is array method takes all elemnts and redue then into single value like sum,average
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = async (giftId, newQuantity) => {
  if (newQuantity < 1) return;
  try {
    await axios.put(`http://localhost:8080/cart/update/${giftId}`, {
      userId: userId,
      quantity: newQuantity
    });
    fetchCart(); // reload cart after update
  } catch (err) {
    console.error("Failed to update cart:", err);
  }
};


  const removeFromCart = (giftId) => {
    axios
      .delete(`http://localhost:8080/cart/remove/${giftId}/${userId}`)
      .then(() => fetchCart())
      .catch((err) => console.error("Failed to remove item:", err));
  };

  // Gift message handlers
  const handleGiftChange = (e) => {
    setGiftForm({ ...giftForm, [e.target.name]: e.target.value });
  };

  const handleGiftSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/giftMessage/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(giftForm)
      });
      const data = await response.json();
      setGeneratedMessage(data.generatedMessage);
      setGiftForm({ name: "", occasion: "", details: "" });
    } catch (error) {
      console.error("Error sending gift message:", error);
      alert("Failed to generate gift message");
    }
  };

  // Payment handler
  const handlePayment = async () => {
    if (!userId) {
      alert("Please login to proceed with payment.");
      navigate("/login");
      return;
    }
    try {
      // Create order on backend
      const orderResponse = await axios.post("http://localhost:8080/payment/create-order", {
        amount: total ,
        currency: "INR",
        receipt: "receipt_" + new Date().getTime(),
        userId: userId
      });

      const order = orderResponse.data;

      // Razorpay options
      const options = {
        key: "rzp_test_RQZn01yVLde3J8", // replace with your Razorpay Test Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Gift Ordering System",
        description: "Purchase Gifts",
        order_id: order.id, // order id from backend
        handler: async function (response) { //hangle is function razorpay calls after user complets payment.
          // On success, update payment status
          const paymentData = {
            orderId: order.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: order.amount / 100, //Razorpay always works with the smallest currency unit:INR → paise
            status: "success",
            userId: userId  // add this
          };

          await axios.post("http://localhost:8080/payment/update-status", paymentData);
          // Show toast notification
          toast.success("Payment Successful!", {
            position: "top-right",  // use string instead of toast.POSITION.TOP_RIGHT
            autoClose: 3000
          });

          // Navigate with state
            navigate("/order-confirmation", {
               state: {
                  paymentId: paymentData.paymentId, // from Razorpay or your response
                  orderId: paymentData.orderId
                }
              });
        },
        prefill: { //dynamic — automatically filled with the logged-in user’s actual details
          name: username,
          email: userEmail,
          contact: userPhone
        },
        theme: { color: "#3399cc" }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment initialization failed");
    }
  };

  return (
    <div className="cart-container">
      <button className="back-btn" onClick={() => navigate("/productslist")}>
        Back to Products
      </button>

      <h2>Your Cart</h2>
      {/* <></> react fragment simply instead of div */}
      {cartItems.length === 0 ? ( <p>Your cart is empty.</p>) : (
        <> 
          <div className="cart-grid">
            {cartItems.map((item) => (
              <div key={item.giftId} className="cart-card">
                <img src={item.imageUrl} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>Price:</strong> ₹{item.price}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.giftId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.giftId, item.quantity + 1)}>+</button>
                  </div>

                  <button className="remove-btn" onClick={() => removeFromCart(item.giftId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="total-price">Total: ₹{total}</h3>

          <button
            style={{ margin: "1rem 0", padding: "10px 20px", cursor: "pointer" }}
            onClick={() => setShowGiftForm(!showGiftForm)}
          >
            Gift Message
          </button>

          <button className="pay-btn" onClick={handlePayment}>
            Proceed to Pay
          </button>

          {showGiftForm && (
            <div
              style={{
                maxWidth: "400px",
                margin: "1rem auto",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px"
              }}
            >
              <h2>Generate Gift Message</h2>
              <form onSubmit={handleGiftSubmit}>
                <div>
                  <label>Name:</label>
                  <br />
                  <input
                    type="text"
                    name="name"
                    value={giftForm.name}
                    onChange={handleGiftChange}
                    required
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                </div>
                <div>
                  <label>Occasion:</label>
                  <br />
                  <input
                    type="text"
                    name="occasion"
                    value={giftForm.occasion}
                    onChange={handleGiftChange}
                    required
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                </div>
                <div>
                  <label>Additional Details:</label>
                  <br />
                  <textarea
                    name="details"
                    value={giftForm.details}
                    onChange={handleGiftChange}
                    rows={3}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "8px 0",
                    width: "100%",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px"
                  }}
                >
                  Generate Message
                </button>
              </form>

              {generatedMessage && (
                <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f4f4f4", borderRadius: "6px" }}>
                  <h3>Generated Message:</h3>
                  <p>{generatedMessage}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
