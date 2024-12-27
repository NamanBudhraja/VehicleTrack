import axios from "axios";
import React, { useState } from "react";

const SignUp = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const handleSignUp = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/createuser", formData)
      .then((response) => {
        console.log("User created:", response.data);

        // Clear error message and form fields
        setErrorMessage("");
        setFormData({
          name: "",
          email: "",
          password: "",
        });

        // Notify parent component (optional)
        onSignUp && onSignUp(response.data);
      })
      .catch((error) => {
        // Handle error and set error message
        const message = error.response?.data?.message || "An error occurred";
        setErrorMessage(message);
      });
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "#007BFF", textAlign: "center" }}>Sign Up</h2>
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}
      <form onSubmit={handleSignUp}>
        <div className="form-row">
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="form-input"
            />
          </label>
        </div>
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
