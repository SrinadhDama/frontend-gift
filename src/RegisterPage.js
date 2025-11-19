import React from "react";
import Register from "./Register";
import "./RegisterPage.css";
import { FaShoppingBag, FaEnvelope, FaCalendarAlt, FaBox } from "react-icons/fa";

function RegisterPage() {
  return (
    <div className="register-page-container">
      {/* Left: Register form */}
      <div className="form-section">
        <div className="register-box">
          <Register />
        </div>
      </div>

      {/* Right: Info about gift system */}
      <div className="info-section">
        <h1> How Our Gift System Works</h1>
        <div className="info-cards-grid">
          <div className="info-card">
            <div className="icon"><FaShoppingBag size={30} color="#d35400" /></div>
            <h3>Choose Gifts</h3>
            <p>Browse and select from a wide variety of gifts for every occasion.</p>
          </div>
          <div className="info-card">
            <div className="icon"><FaEnvelope size={30} color="#d35400" /></div>
            <h3>Personalize</h3>
            <p>Add your custom message to make your gift more special.</p>
          </div>
          <div className="info-card">
            <div className="icon"><FaCalendarAlt size={30} color="#d35400" /></div>
            <h3>Set Delivery</h3>
            <p>Choose the delivery date and location with ease.</p>
          </div>
          <div className="info-card">
            <div className="icon"><FaBox size={30} color="#d35400" /></div>
            <h3>Track Orders</h3>
            <p>Keep track of your gifts until they reach their destination.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
