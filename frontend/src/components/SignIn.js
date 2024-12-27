import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/signin", formData)
      .then((response) => {
        console.log("Sign-in successful:", response.data);

        // Clear error message
        setErrorMessage("");

        // Update auth status
        login(response.data.user);

        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        const message = error.response?.data?.message || "An error occurred";
        setErrorMessage(message);
      });
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "#007BFF", textAlign: "center" }}>Sign In</h2>
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}
      <form onSubmit={handleSignIn}>
        <div className="form-row">
          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="form-input"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Password:
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="form-input"
            />
          </label>
        </div>
        <button type="submit" className="form-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
