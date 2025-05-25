import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/api";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [cashPrize, setCashPrize] = useState("");
  const [date, setDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [editId, setEditId] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await fetchUserProfile();
        if (!user.isAdmin) {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    checkAdmin();
    fetchTournaments();
  }, [navigate]);

  const fetchTournaments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tournaments/list`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTournaments(data);
      } else {
        console.error("Expected array but got:", data);
        setTournaments([]); // fallback clean
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to load tournaments", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const resetForm = () => {
    setName("");
    setCashPrize("");
    setDate("");
    setMaxParticipants("");
    setEditId(null);
  };

  const handleCreate = async () => {
    if (!name || !date || !cashPrize || !maxParticipants) {
      return showToast("❌ All fields are required.", "error");
    }

    try {
      const res = await fetch(`${API_URL}/api/tournaments/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, cashPrize: Number(cashPrize), date, maxParticipants: Number(maxParticipants) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      showToast("✅ Tournament created", "success");
      resetForm();
      fetchTournaments();
    } catch (err) {
      console.error(err);
      showToast("❌ " + err.message, "error");
    }
  };

  const handleUpdate = async () => {
    if (!name || !date || !cashPrize || !maxParticipants) {
      return showToast("❌ All fields are required.", "error");
    }

    try {
      const res = await fetch(`${API_URL}/api/tournaments/admin/update/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, cashPrize: Number(cashPrize), date, maxParticipants: Number(maxParticipants) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      showToast("✅ Tournament updated", "success");
      resetForm();
      fetchTournaments();
    } catch (err) {
      console.error(err);
      showToast("❌ " + err.message, "error");
    }
  };

  const handleDeleteRequest = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tournaments/admin/delete/${confirmDeleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      showToast("✅ Tournament deleted", "success");
      setConfirmDeleteId(null);
      fetchTournaments();
    } catch (err) {
      console.error(err);
      showToast("❌ " + err.message, "error");
    }
  };

  const handleEdit = (t) => {
    setEditId(t._id);
    setName(t.name);
    setCashPrize(t.cashPrize);
    setDate(t.date?.slice(0, 10));
    setMaxParticipants(t.maxParticipants);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-900 p-6 rounded-lg text-white shadow-lg">
      {/* 🔥 Toast en haut */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white font-bold text-center`}>
          {toast.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Admin Panel</h1>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Tournament name"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cash prize"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={cashPrize}
          onChange={(e) => setCashPrize(e.target.value)}
        />
        <input
          type="date"
          placeholder="Tournament date"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max participants"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
        />
        {editId ? (
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded font-bold"
            >
              Update Tournament
            </button>
            <button
              onClick={resetForm}
              className="w-full bg-gray-600 hover:bg-gray-700 py-3 rounded font-bold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleCreate}
            className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded font-bold"
          >
            Create Tournament
          </button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Existing Tournaments</h2>
      <ul className="space-y-3">
        {Array.isArray(tournaments) && tournaments.length > 0 ? (
          tournaments.map((t) => (
            <li
              key={t._id}
              className="bg-gray-800 p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p className="font-bold text-lg">{t.name}</p>
                <p className="text-sm text-gray-400">
                  💰 {t.cashPrize}$ — 📅 {new Date(t.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">👥 Max participants: {t.maxParticipants}</p>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRequest(t._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No tournaments found.</p>
        )}
      </ul>

      {/* 🔥 Popup de confirmation suppression */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this tournament?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
