import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });

      // SUCCESS — Save token
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");

    } catch (err: any) {
      console.log("LOGIN ERROR:", err);

      // If backend returns JSON error (FastAPI)
      if (err.response) {
        if (err.response.status === 404) {
          setError("User not found");
        } else if (err.response.status === 401) {
          setError("Incorrect password");
        } else {
          setError(err.response.data.detail || "Login failed");
        }
      } else {
        setError("Cannot connect to server");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
          Welcome to <span className="text-green-600">MediPredict</span>
        </h2>

        <p className="text-sm text-center text-slate-500 mb-6">
          Manage your health and access quick services.
        </p>

        {/* 🔥 ERROR MESSAGE SHOWN HERE */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
