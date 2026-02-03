import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AstrologerList.css";

/* =====================================================
   PAYMENT MODAL
===================================================== */
const PaymentGatewayModal = ({ onClose, amount }) => {
  const [paymentState, setPaymentState] = useState("idle");

  const handlePayment = () => {
    setPaymentState("processing");

    setTimeout(() => {
      setPaymentState("success");
      setTimeout(onClose, 1500);
    }, 1500);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>

        {paymentState === "idle" && (
          <>
            <h2 className="modal-title">Secure Payment</h2>
            <p className="payment-amount-display">₹{amount}</p>
            <button className="connect-button" onClick={handlePayment}>
              Pay Now
            </button>
          </>
        )}

        {paymentState === "processing" && <p>Processing...</p>}
        {paymentState === "success" && <p>Payment Successful ✅</p>}
      </motion.div>
    </motion.div>
  );
};

/* =====================================================
   CHAT POPUP  (FIXED VERSION)
===================================================== */

const ChatPopup = ({ astro, onClose }) => {
  const [messages, setMessages] = useState([
    { from: "astro", text: "Namaste 🙏 How can I help you today?" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "astro", text: "Sure, I will guide you 😊" },
      ]);
    }, 700);
  };

  return (
    <motion.div
      className="chat-popup"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.25 }}
    >
      <div className="chat-header">
        <span>{astro?.name}</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </motion.div>
  );
};

/* =====================================================
   MAIN PAGE
===================================================== */
const AstrologerList = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState(0);

  /* ✅ FIXED — THIS WAS MISSING */
  const [chatAstro, setChatAstro] = useState(null);

  useEffect(() => {
    fetch("https://kalpjyotish.com/api/api/astrologer/all")
      .then((r) => r.json())
      .then((d) => {
        setAstrologers(d.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-text">Loading...</div>;

  return (
    <>
      <div className="astrologer-list-container">
        <div className="astro-grid">
          {astrologers.map((astro) => (
            <div key={astro._id} className="astro-card">
              <img
                className="astro-img"
                src={
                  astro.user_profile ||
                  astro.profilePhoto ||
                  "https://ui-avatars.com/api/?name=" + astro.name
                }
                alt={astro.name}
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" + astro.name;
                }}
              />

              <div className="astro-info">
                <h3>{astro.name}</h3>
                <p>{astro.language?.join(", ")}</p>
              </div>

              <div className="astro-actions">
                <button
                  className="chat-btn"
                  onClick={() => setChatAstro(astro)}
                >
                  CHAT
                </button>

                <button
                  className="call-btn"
                  onClick={() => setIsAddMoneyModalOpen(true)}
                >
                  CALL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isGatewayModalOpen && (
          <PaymentGatewayModal
            amount={paymentAmount}
            onClose={() => setIsGatewayModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* CHAT POPUP */}
      <AnimatePresence>
        {chatAstro && (
          <ChatPopup astro={chatAstro} onClose={() => setChatAstro(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default AstrologerList;
