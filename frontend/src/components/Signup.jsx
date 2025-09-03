import { useState } from "react";
import { User, Mail, LockKeyhole, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/api";

export default function Signup({ className, handleClick }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(true);

  const validateEmail = (email) => /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);
  const validatePassword = (pass) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) return setError("Invalid email format.");
    if (!validatePhoneNumber(phoneNumber)) {
      setIsValidPhone(false);
      return setError("Invalid phone number.");
    }
    setIsValidPhone(true);

    if (!validatePassword(password))
      return setError("Password must be 8+ characters with upper, lower, number.");
    if (!role) return setError("Please select a role.");

    const userData = { username, email, password, phoneNumber, role };
    console.log("📤 Final signup data:", userData);

    try {
      setLoading(true);
      const response = await signup(userData);
      console.log("✅ Signup successful:", response);

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setRole("");

      navigate("/auth?login=true");
    } catch (error) {
      console.error("❌ Signup error:", error);
      if (error.errors) {
        setError(JSON.stringify(error.errors));
      } else {
        setError(error.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 md:p-8 w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto ${className}`}>
      <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-6 md:mb-10">
        Sign Up
      </h2>

      <form
        onSubmit={handleSignup}
        className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 md:p-10"
      >
        {/* Username Input */}
        <div className="mb-4 relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            aria-label="Username"
            className="w-full pl-10 pr-4 py-2 bg-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-300"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="email"
            aria-label="Email"
            className="w-full pl-10 pr-4 py-2 bg-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-300"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="tel"
            aria-label="Phone Number"
            className="w-full pl-10 pr-4 py-2 bg-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-300"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {!isValidPhone && (
            <p className="text-red-500 text-sm mt-1">Invalid phone number.</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <select
            aria-label="Role"
            className="w-full px-4 py-2 bg-white/30 rounded-xl focus:outline-none text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled className="bg-indigo-900">Select your role</option>
            <option value="admin" className="bg-indigo-900">Admin</option>
            <option value="user" className="bg-indigo-900">User</option>
          </select>
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="password"
            aria-label="Password"
            className="w-full pl-10 pr-4 py-2 bg-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-300"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold mb-4 py-2 rounded-lg text-lg hover:bg-indigo-500 transition duration-300"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center mb-4">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        {/* Google Signup */}
        <button
          type="button"
          aria-label="Sign up with Google"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/30 hover:bg-white/50 transition duration-300 text-white"
        >
          <img
            className="w-6 h-6"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google Logo"
          />
          Sign Up with Google
        </button>

        {/* Login Link */}
        <p className="text-center font-medium mt-2 md:hidden text-white">
          Already have an account?{" "}
          <a
            onClick={handleClick}
            className="text-indigo-500 font-semibold cursor-pointer hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
