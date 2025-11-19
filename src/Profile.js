import { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("myprofile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await axios.get(`http://localhost:8080/users/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch orders when "My Orders" tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== "myorders" || !user) return;

      setLoadingOrders(true);
      try {
        const response = await axios.get(`http://localhost:8080/orders/${user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab, user]);

  // Helper function
const statusToProgress = (status) => {
  switch (status) {
    case "Pending": return 25;
    case "Processed": return 50;
    case "Shipped": return 75;
    case "Delivered": return 100;
    default: return 0;
  }
};

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <ul>
            <li
              className={activeTab === "myprofile" ? "active" : ""}
              onClick={() => setActiveTab("myprofile")}
            >
              My Profile
            </li>
            <li
              className={activeTab === "myorders" ? "active" : ""}
              onClick={() => setActiveTab("myorders")}
            >
              My Orders
            </li>
            <li
              className={activeTab === "mystuff" ? "active" : ""}
              onClick={() => setActiveTab("mystuff")}
            >
              My Stuff
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {loadingUser && <p>Loading profile...</p>}

          {!loadingUser && user && activeTab === "myprofile" && (
            <div className="profile-card">
              <h2>Welcome, {user.username}!</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.mobilenumber}</p>
            </div>
          )}

          {activeTab === "myorders" && (
            <div className="orders-section">
              {loadingOrders && <p>Loading orders...</p>}
              {!loadingOrders && orders.length === 0 && <p>No orders found.</p>}
              {!loadingOrders && orders.length > 0 && (
              <ul className="orders-list">
                {orders.map((order) => (
                  <li key={order.id} className="order-card">
                    <h3>Order #{order.id}</h3>
                    <div className="order-details">
                      <div><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</div>
                      <div><strong>Status:</strong> {order.paymentStatus}</div>
                      <div><strong>Total Amount:</strong> ₹{order.totalAmount}</div>
                    </div>
                    <div className="order-products">
                      {order.productNames ? order.productNames.split(",").map((name, index) => (
                        <span key={index}>{name.trim()}</span>
                      ))
                      : <span>No products found</span>
                      }
                    </div>
                    {/* Tracking Progress */}
                    <div className="order-tracking">
                      <h4>Order Tracking</h4>
                      <div className="tracking-bar-container">
                        <div className="tracking-bar" style={{ width: `${statusToProgress(order.orderStatus)}%` }}/></div>
                        <div className="tracking-labels">
                          <span>Pending</span>
                          <span>Processed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                  </li>
                ))}
              </ul>
            )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
