import axios from "axios";

// 🔧 Axios Instance Setup
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // required for sessions/cookies if using them
});

// 🔐 Attach Token to Requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`✅ Token attached to ${config.url}`);
    } else {
      console.warn(`⚠️ No token in localStorage for ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("❌ Axios request error:", error);
    return Promise.reject(error);
  }
);

// ❌ Handle Auth Errors Globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("🚫 Unauthorized - clearing token");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;


// Response Interceptor: Handle 401/403
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("🚨 Auth error, clearing token:", error.response.status);
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ✅ Login
export const login = async (userData) => {
  try {
    console.log("📤 Sending login request:", userData);
    const res = await API.post("/auth/login", userData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      console.log("🔑 Token saved after login");
    }

    return res.data;
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Login failed" };
  }
};

// ✅ Signup
export const signup = async (userData) => {
  try {
    console.log("📤 Sending signup request:", userData);
    const res = await API.post("/auth/signup", userData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      console.log("🔑 Token saved after signup");
    }

    return res.data;
  } catch (err) {
    console.error("❌ Signup error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Signup failed" };
  }
};

// ✅ Fetch profile (corrected version)
export const fetchUserProfile = async () => {
  try {
    console.log("📤 Fetching profile...");
    const res = await API.get("/auth/user/profile"); // token auto-attached
    console.log("✅ Profile:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Profile error:", err);
    throw err;
  }
};

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("token");
  console.log("🚪 Logged out, token cleared");
};

// ✅ Google OAuth redirect
export const googleAuth = () => {
  console.log("🔗 Redirecting to Google...");
  window.location.href = "http://localhost:5000/api/auth/google";
};

// ✅ Save OAuth token
export const handleOAuthCallback = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    console.log("🔑 OAuth token saved");
    return true;
  }
  return false;
};

// ✅ Check authentication
export const isAuthenticated = () => !!localStorage.getItem("token");

// ✅ Get all events
export const getEvents = async () => {
  try {
    const res = await API.get("/events/all");
    return res.data;
  } catch (err) {
    console.error("❌ Get events error:", err);
    throw err.response?.data || { message: "Failed to fetch events" };
  }
};

// ✅ Create event
export const createEvent = async (eventData) => {
  try {
    const res = await API.post("/events/create", eventData);
    return res.data;
  } catch (err) {
    console.error("❌ Create event error:", err);
    throw err.response?.data || { message: "Failed to create event" };
  }
};

// ✅ Mark attendance
export const checkInAttendance = async (eventId, userId) => {
  try {
    const res = await API.post("/attendance/check-in", { eventId, userId });
    return res.data;
  } catch (err) {
    console.error("❌ Check-in error:", err);
    throw err.response?.data || { message: "Failed to mark attendance" };
  }
};
