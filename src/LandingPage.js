// LandingPage.js
import React from "react";
import Login from "./Login";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="left-section">
        <h1>Welcome to Gift Ordering System</h1>
        <p>
          Order gifts for your loved ones with just a few clicks.  
          Choose from a wide variety of products, add a personalized gift message,  
          and let us deliver happiness to your doorstep.
        </p>
      </div>

      <div className="right-section">
        <div className="login-box">
          <Login />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
