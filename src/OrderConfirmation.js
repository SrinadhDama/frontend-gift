import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    paymentId: "",
    orderId: "",
  });

  useEffect(() => {
    if (location.state) {
      setPaymentData({
        paymentId: location.state.paymentId || "",
        orderId: location.state.orderId || "",
      });
    }
  }, [location.state]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Successful!</h2>
      <p>Thank you for your order.</p>
      {paymentData.paymentId && paymentData.orderId ? (
        <>
          <p>
            <strong>Payment ID:</strong> {paymentData.paymentId}
          </p>
          <p>
            <strong>Order ID:</strong> {paymentData.orderId}
          </p>
        </>
      ) : (
        <p>Payment details not found.</p>
      )}
      <button
        onClick={() => navigate("/productslist")}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
