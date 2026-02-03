import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import authImage from "../assets/authImage.jpg";
import "./AuthModal.css";

export default function AuthModal({ onClose }) {
  const [step, setStep] = useState("mobile"); // mobile | otp | register
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ---------------- API HELPERS ---------------- */

  const checkUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (!data.exists) {
        setStep("register");
      } else {
        await sendOtp();
      }
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      await fetch("/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      setMessage(`OTP sent to ${mobile}`);
      setStep("otp");
    } catch {
      setError("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await res.json();

      if (!data.success) {
        setError("Invalid OTP");
        return;
      }

      // ✅ LOGIN SUCCESS
      localStorage.setItem("token", data.token);
      onClose();
    } catch {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    setError("");
    try {
      await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile }),
      });
      await sendOtp();
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <motion.div
        className="auth-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose}>
          <IoClose />
        </button>

        {/* LEFT */}
        <div className="auth-left">
          <img src={authImage} alt="Auth" />
          {/* <h2>Welcome</h2>
          <p>Secure login with OTP</p> */}
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          {error && <p className="error-text">{error}</p>}
          {message && <p className="info-text">{message}</p>}

          {step === "mobile" && (
            <>
              <h3>Sign In</h3>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <button
                disabled={mobile.length !== 10 || loading}
                onClick={checkUser}
              >
                {loading ? "Please wait..." : "Continue"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <h3>Verify OTP</h3>
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                disabled={otp.length !== 6 || loading}
                onClick={verifyOtp}
              >
                {loading ? "Verifying..." : "Login"}
              </button>
            </>
          )}

          {step === "register" && (
            <>
              <h3>Create Account</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input type="tel" value={mobile} disabled />
              <button
                disabled={!name || loading}
                onClick={registerUser}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
