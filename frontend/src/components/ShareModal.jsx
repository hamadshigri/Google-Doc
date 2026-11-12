import { useState } from "react";
import { toast } from "react-toastify";
import { createDocumentInvitation } from "../lib/documentShare";

const ShareModal = ({ documentId, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleShare = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      const response = await createDocumentInvitation(
        documentId,
        {
          email: email.trim(),
          role,
        },
        token
      );

      toast.success("Invitation sent successfully!");

      setEmail("");
      setRole("editor");
      onClose();

    } catch (error) {
      console.error("Invitation error:", error);

      toast.error(
        error.response?.data?.message || "Failed to send invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">
            Share Document
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 text-2xl disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleShare} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Permission
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ShareModal;
