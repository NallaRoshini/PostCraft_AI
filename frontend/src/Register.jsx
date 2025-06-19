import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "./firebase";
import { doc, setDoc} from "firebase/firestore";
import { toast } from "react-toastify";
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }
    try {
      const userCredential=await register(email, password);
      const user= userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        firstName,
        lastName,
        createdAt: new Date(),
      });
      toast.success("User Registered Successfully!",{
        position:"top-center",
      });
      navigate("/");
    } catch (err) {
      toast.error("Registration failed. Please try again.",{
        position:"bottom-center",
      });
      /*setError("Registration failed. Please try again.");*/
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
    <div className="absolute top-6 left-6 flex items-center gap-2">
    <div className="text-3xl font-extrabold text-indigo-700">PostCraft<span className="text-indigo-500"> AI</span></div>
    </div>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-0.5">Sign up</h1>
        <p className="italic text-gray-500 mb-6 text-center text-sm">Let your ideas take off with PostCraft AI.</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
