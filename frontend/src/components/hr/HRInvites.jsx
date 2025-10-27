import React from "react";

const HRInvites = () => {
  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h1 className="text-xl font-semibold mb-4 text-gray-700">Invitations</h1>
      <p className="text-gray-600 mb-4">
        Generate and share test links or QR codes with your HR participants.
      </p>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        + Generate New Invite
      </button>
    </div>
  );
};

export default HRInvites;
