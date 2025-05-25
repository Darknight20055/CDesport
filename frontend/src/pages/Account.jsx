import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/api";

const API_URL = process.env.REACT_APP_API_URL;

export default function Account() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const availableAvatars = ["fade.png", "jett.png", "reyna.png", "raze.png"];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    loadUserProfile();
  }, []);

  const handleStartEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...user });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUser(originalData);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          pseudo: user.pseudo,
          avatar: user.avatar,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error(data.error || "Server error");
        return;
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (err) {
      console.error("Error during update:", err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setPasswordMessage("❌ All fields are required.");
    }
    if (newPassword !== confirmPassword) {
      return setPasswordMessage("❌ New passwords do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return setPasswordMessage("❌ " + (data.error || data.message || "Server error"));
      }

      setPasswordMessage("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPasswordMessage("❌ Network error");
    }
  };

  if (!user) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-lg shadow-lg mt-16 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400">My Account</h1>

      {user.avatar && (
        <div className="flex justify-center mb-8">
          <img
            src={`/avatars/${user.avatar}`}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-cyan-400"
          />
        </div>
      )}

      <form className="space-y-6">
        <div>
          <label className="block mb-2 text-gray-400">Email</label>
          <input
            type="email"
            disabled={!isEditing}
            className="w-full p-3 bg-gray-800 text-white border border-cyan-600 rounded focus:ring-2 focus:ring-cyan-400"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-400">Username</label>
          <input
            type="text"
            disabled={!isEditing}
            className="w-full p-3 bg-gray-800 text-white border border-cyan-600 rounded focus:ring-2 focus:ring-cyan-400"
            value={user.pseudo}
            onChange={(e) => setUser({ ...user, pseudo: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-400">Profile Picture</label>
          <div className="flex flex-wrap gap-4 justify-center">
            {availableAvatars.map((img) => (
              <img
                key={img}
                src={`/avatars/${img}`}
                alt={img}
                onClick={() => isEditing && setUser({ ...user, avatar: img })}
                className={`w-20 h-20 object-cover rounded-full cursor-pointer border-4 ${
                  user.avatar === img ? "border-cyan-400" : "border-gray-700"
                } hover:scale-110 transition`}
              />
            ))}
          </div>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleStartEdit}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-bold rounded transition"
          >
            Edit
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="w-full bg-green-600 hover:bg-green-700 py-3 font-bold rounded transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full bg-gray-700 hover:bg-gray-800 py-3 font-bold rounded transition"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <hr className="my-8 border-gray-700" />

      <h2 className="text-xl font-bold mb-4 text-cyan-400">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <input
          type="password"
          placeholder="Current password"
          className="w-full p-3 bg-gray-800 text-white border border-cyan-600 rounded focus:ring-2 focus:ring-cyan-400"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 bg-gray-800 text-white border border-cyan-600 rounded focus:ring-2 focus:ring-cyan-400"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 bg-gray-800 text-white border border-cyan-600 rounded focus:ring-2 focus:ring-cyan-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 font-bold rounded transition transform hover:scale-105"
        >
          Update Password
        </button>
      </form>

      {passwordMessage && (
        <p className="mt-4 text-center font-semibold text-red-500">{passwordMessage}</p>
      )}

      {showSuccessPopup && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all animate-bounce">
          ✅ Profile updated!
        </div>
      )}
    </div>
  );
}
