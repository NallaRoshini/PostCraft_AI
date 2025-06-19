import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("User Logged In Successfully!", {
        position: "top-center",
      });
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials. Try again.", {
        position: "bottom-center",
      });
      // setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
    <div className="absolute top-6 left-6 flex items-center gap-2">
    <div className="text-3xl font-extrabold text-indigo-700">PostCraft<span className="text-indigo-500"> AI</span></div>
    </div>

      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-0.5">Login</h1>
        <p className="italic text-gray-500 mb-6 text-center text-sm">Welcome back to PostCraft AI — Let's get started!</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mx-auto block w-30 bg-white text-indigo-700 py-2 rounded-lg border-1 border-indigo-700 hover:bg-indigo-700 hover:text-white transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
