import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SendInvites = () => {
  const [rows, setRows] = useState([{ email: "", phone: "" }]);
  const [loading, setLoading] = useState(false);

  // Handle change for both email & phone fields
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { email: "", phone: "" }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    const emails = rows
      .map((r) => r.email.trim())
      .filter((e) => e !== "");
    const phones = rows
      .map((r) => r.phone.trim())
      .filter((p) => p !== "");

    if (!emails.length && !phones.length) {
      return toast.warn("Please enter at least one email or WhatsApp number.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/send-invites`,
        { emails, phones }
      );

      toast.success("✅ Invites sent successfully!");
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        📩 Send Test Invites
      </h2>

      {/* Table Header */}
      <div className="grid grid-cols-2 gap-4 font-medium text-gray-700 mb-2">
        <span>Email</span>
        <span>WhatsApp Number</span>
      </div>

      {/* Input Rows */}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 mb-3 items-center">
          <input
            type="email"
            placeholder="Enter email"
            value={row.email}
            onChange={(e) => handleChange(i, "email", e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter WhatsApp number"
              value={row.phone}
              onChange={(e) => handleChange(i, "phone", e.target.value)}
              className="border p-2 rounded-md w-full"
            />
            {i > 0 && (
              <button
                onClick={() => removeRow(i)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={addRow}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded-md font-semibold ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? "Sending..." : "🚀 Send Invites"}
        </button>
      </div>
    </div>
  );
};

export default SendInvites;
