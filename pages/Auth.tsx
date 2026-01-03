import React, { useState } from "react";
import axios from "axios";

export default function Auth({ onSignupRedirect, onLoginSuccess }) {
  // ------------------ SIGNUP STATE ------------------
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // ------------------ LOGIN STATE ------------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // ⭐ SHOW ERRORS

  // ------------------ SIGNUP HANDLER ------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/signup", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        age: 0,
        gender: ""
      });

      localStorage.setItem("email", signupEmail);
      localStorage.setItem("name", signupName);
      localStorage.setItem("first_login", "1");

      onSignupRedirect();
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      alert("Signup failed. Try again.");
    }
  };

  // ------------------ LOGIN HANDLER ------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); // CLEAR OLD ERRORS

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email: loginEmail,
        password: loginPassword
      });

      // SUCCESS
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("email", loginEmail);
      localStorage.setItem("name", res.data.name);

      const backendFirst = res.data.first_login;
      localStorage.setItem("first_login", String(backendFirst));

      onLoginSuccess(backendFirst);

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      // ⭐ CATCH BACKEND ERRORS AND SHOW THEM IN UI
      if (err.response) {
        if (err.response.status === 404) {
          setLoginError("User not found");
        } else if (err.response.status === 401) {
          setLoginError("Incorrect password");
        } else {
          setLoginError(err.response.data.detail || "Login failed");
        }
      } else {
        setLoginError("Unable to reach the server");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ------------------ SIGNUP UI ------------------ */}
        <div className="p-6 bg-teal-50 rounded-xl">
          <h2 className="text-xl font-bold text-teal-700">New User</h2>
          <p className="text-sm text-gray-600 mb-4">Create your account</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              className="input"
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />

            <input
              className="input"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-teal-600 text-white w-full py-2 rounded-lg"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* ------------------ LOGIN UI ------------------ */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800">Login</h2>

          {/* ⭐ SHOW LOGIN ERROR MESSAGE */}
          {loginError && (
            <div className="bg-red-100 text-red-700 p-2 rounded my-3 text-sm text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              className="input"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-teal-600 text-white w-full py-2 rounded-lg"
            >
              Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
