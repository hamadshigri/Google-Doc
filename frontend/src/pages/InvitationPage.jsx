import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  acceptInvitation,
  getInvitationDetails,
  rejectInvitation
} from "../lib/documentShare.js";

import Navbar from "../components/Navbar.jsx"
import { toast } from "react-toastify";

const InvitationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);


  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await getInvitationDetails(id, token);
        setInvitation(response.data.invitation);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load invitation")
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [id, token]);

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const response = await acceptInvitation(id, token);
      toast.success("Invitation accepted successfully!");
      const documentId = response.data.invitation.document._id;

      navigate(`/document/${documentId}`, {
        replace: true,
      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept invitation");
    } finally {
      setActionLoading(false);
    }
  }


  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectInvitation(id, token);

      setInvitation((prev) => ({
        ...prev,
        status: "rejected"
      }))

      toast.success("Invitation rejected successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject invitation")
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-[70vh]">
          <p>Loading invitation...</p>
        </div>
      </>
    )
  }

  if (!invitation) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
          <h2 className="text-xl font-bold">Invitation Not Found</h2>
          <p className="text-gray-500">
            This invitation may be invalid or unavailable.
          </p>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-5 py-2 rounded">
            Go Home
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="flex justify-center items-center min-h-[75vh] px-4">
        <div className="max-w-lg w-full border rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-3">Document Invitation</h1>
          <p className="text-gray-500 mb-6">
            You have received an invitation to access the following document.
          </p>

          <div className="bg-gray-100 rounded-lg p-5 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Document</p>
              <h2 className="text-lg font-semibold">
                {invitation.document?.title}
              </h2>
            </div>
            <div>
              <p className="text-sm text-gray-500">Invited By</p>
              <p className="font-medium">{invitation.owner?.name}</p>
              <p className="text-sm text-gray-500">{invitation.owner?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Your Permission</p>
              <span className="capitalize font-semi-bold"> {invitation.role} </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Invitation Status</p>
              <span className="capitalize font-semibold">{invitation.status}</span>
            </div>
          </div>
          {invitation.status === "pending" && (
            <div className="flex gap-3 mt-6">
              <button onClick={handleAccept} disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50">{actionLoading ? "Please wait..." : "Accept Invitation"}</button>

              <button onClick={handleReject} disabled={actionLoading} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg disabled:opacity-50">Reject</button>
            </div>
          )}

          {invitation.status === "accepted" && (
            <button onClick={() => navigate(`/document/${invitation.document._id}`)} className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6">Open Document</button>
          )}
          {invitation.status === "rejected" && (<p className="text-red-600 text-center mt-6">You have rejected this invitation.</p>)}
        </div>
      </div>
    </>
  )


}

export default InvitationPage