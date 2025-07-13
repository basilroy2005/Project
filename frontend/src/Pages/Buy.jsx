import React, { useState } from "react";
 // Move your CSS to Buy.css or use CSS-in-JS
import './CSS/Buy.css';
import { ShopContext } from "../Context/ShopContext";
const Buy = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const match = v.substring(0, 16);
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError("Please fill in all required fields");
      setIsProcessing(false);
      return;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid 16-digit card number");
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const { getTotalCartAmount } = React.useContext(ShopContext);

  if (paymentSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-header">
              <h2>Payment Confirmation</h2>
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase. Your order has been processed.</p>
        </div>
      </div>
    );
  }

return (
      <div className="payment-container">
            <div className="payment-header">
                  <h2>Payment Information</h2>
                  <p>Enter your card details to complete the purchase</p>
            </div>

            <form className="payment-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                        <label htmlFor="cardName">Name on Card</label>
                        <input
                              className="form-control"
                              type="text"
                              id="cardName"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder=""
                              required
                        />
                  </div>

                  <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                              className="form-control"
                              type="text"
                              id="cardNumber"
                              value={formatCardNumber(cardNumber)}
                              onChange={(e) => setCardNumber(e.target.value)}
                              maxLength="19"
                              placeholder=""
                              required
                        />
                  </div>

                  <div className="card-row">
                        <div className="form-group">
                              <label htmlFor="expiryDate">Expiry Date</label>
                              <input
                                    className="form-control"
                                    type="text"
                                    id="expiryDate"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    maxLength="5"
                                    placeholder="MM/YY"
                                    required
                              />
                        </div>

                        <div className="form-group">
                              <label htmlFor="cvv">CVV</label>
                              <input
                                    className="form-control"
                                    type="text"
                                    id="cvv"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength="4"
                                    placeholder=""
                                    required
                              />
                        </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <div className="payment-summary">
                        <div className="summary-item">
                              <span>Cart Amount:</span>
                              <span>${getTotalCartAmount()}</span>
                        </div>
                        <div className="summary-item">
                              <span>Tax:</span>
                              <span>$10</span>
                        </div>
                        <div className="summary-item summary-total">
                              <span>Total:</span>
                              <span>${(getTotalCartAmount() + 10).toFixed(2)}</span>
                        </div>
                  </div>

                  <button
                        type="submit"
                        className="submit-btn"
                        disabled={isProcessing}
                  >
                        {isProcessing ? "Processing..." : "PAY"}
                  </button>
            </form>
      </div>
);
};

export default Buy;