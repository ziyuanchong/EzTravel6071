import React, { useState } from "react";
import { signUp } from "./auth";
import "./SignUp.css";
import { Link } from "react-router-dom"

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match. Please re-enter.");
      return;
    }

    const { user, error } = await signUp(email, password);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(
        "Sign up successful! Please check your email to confirm your account."
      );
    }
  };

  return (
    <div className="background">
      <div className="header">
        <Link to="/" className="logo">
        <h1>EzTravel</h1>
        </Link>
      </div>
      <div className="container">
        <form onSubmit={handleSignUp}>
          <h1>Travel With Us!</h1>
          <div className="input-box">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
          <div>{message}</div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
