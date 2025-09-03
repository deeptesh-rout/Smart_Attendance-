import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import API from "../../utils/api"; 

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/auth/user/profile");
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          throw new Error("Invalid user response");
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div
      className="min-h-screen bg-gray-900 text-white relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg-pattern.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.9,
      }}
    >
      <div className="relative z-10 p-6 md:p-10">
        <Header toggleSidebar={toggleSidebar} />
        <div ref={sidebarRef}>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        <div className="flex flex-col justify-center items-center text-center w-full max-w-4xl mx-auto mt-20">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">User Profile</h1>

          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="User Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-lg"
              />
            </div>

            {/* Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Basic Information</h2>
                <InfoField label="Full Name" value={user.fullName} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone Number" value={user.phoneNumber} />
              </div>

              {/* Personal Info */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Personal Information</h2>
                <InfoField label="Date of Birth" value={user.dateOfBirth} />
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm font-bold mb-2">Address</label>
                  <textarea
                    className="w-full p-3 rounded bg-gray-700 text-white"
                    value={user.address || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Settings & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Account Settings</h2>
                <Button label="Change Password" onClick={() => navigate("/change-password")} />
                <Button label="Notification Preferences" onClick={() => navigate("/notification-preferences")} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Contact Information</h2>
                <div className="flex flex-col items-center">
                  <ContactLink href={user.twitter} label="Twitter" />
                  <ContactLink href={user.linkedin} label="LinkedIn" />
                  <ContactLink href={user.facebook} label="Facebook" />
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              className="mt-8 w-full bg-red-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-red-500"
              onClick={() => navigate("/logout")}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable UI components

const InfoField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-sm font-bold mb-2">{label}</label>
    <input
      type="text"
      className="w-full p-3 rounded bg-gray-700 text-white"
      value={value || ""}
      readOnly
    />
  </div>
);

const Button = ({ label, onClick }) => (
  <button
    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-500 mb-4"
    onClick={onClick}
  >
    {label}
  </button>
);

const ContactLink = ({ href, label }) => (
  <a
    href={href || "#"}
    className="text-blue-400 hover:underline mb-2"
    target="_blank"
    rel="noopener noreferrer"
  >
    {label}
  </a>
);

export default UserProfile;
