import mongoose from "mongoose";
import Document from "../models/document.model.js";
import User from "../models/user.model.js";
import DocumentShare from "../models/documentShare.model.js";
import { sendInvitationEmail } from "../services/email.service.js";

export const createDocumentInvitation = async (req, res) => {
  try {
    const documentId = req.params.id;
    const { email, role = "editor" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid document ID" });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const inviteeEmail = email.trim().toLowerCase();

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    if (document.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the document owner can invite users",
      });
    }

    const owner = await User.findById(req.user);

    if (owner.email.toLowerCase() === inviteeEmail) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot invite yourself" });
    }

    const existingShare = await DocumentShare.findOne({
      document: documentId,
      inviteeEmail,
      status: {
        $in: ["pending", "accepted"],
      },
    });

    if (existingShare) {
      return res.status(409).json({
        success: false,
        message: "This user is already invited or has access",
      });
    }

    const invitedUser = await User.findOne({ email: inviteeEmail });

    const invitation = await DocumentShare.create({
      document: documentId,
      owner: req.user,
      inviteeEmail,
      invitedUser: invitedUser?._id || null,
      role,
      status: "pending",
    });

    try {
      await sendInvitationEmail({
        inviteeEmail,
        documentTitle: document.title,
        role,
        invitationId: invitation._id,
      });

    } catch (error) {
      console.log("Email sending failed", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      invitation,
    });
  } catch (error) {
    console.error("Invitation Error:", error);

    return res
      .status(500)
      .json({ status: false, message: "Failed to create Invitation" });
  }
};

export const getInvitationDetails = async (req, res) => {
  try {
    const { invitationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation ID",
      });
    }

    const user = await User.findById(req.user).select("email");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const invitation = await DocumentShare.findOne({
      _id: invitationId,
      inviteeEmail: user.email.toLowerCase(),
    })
      .populate("document", "title")
      .populate("owner", "name email");

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation._id,
        document: invitation.document,
        owner: invitation.owner,
        role: invitation.role,
        status: invitation.status,
        createdAt: invitation.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Invitation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve invitation",
    });
  }
};

export const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation ID",
      });
    }

    const user = await User.findById(req.user).select("email");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const invitation = await DocumentShare.findOneAndUpdate(
      {
        _id: invitationId,
        inviteeEmail: user.email.toLowerCase(),
        status: "pending",
      },
      {
        $set: {
          status: "accepted",
          invitedUser: user._id,
        },
      },
      { returnDocument: "after" },
    ).populate("document", "title");

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Pending invitation not found or already processed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      invitation,
    });
  } catch (error) {
    console.error("Accept Invitation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept invitation",
    });
  }
};

export const rejectInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation ID",
      });
    }

    const user = await User.findById(req.user).select("email");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const invitation = await DocumentShare.findOneAndUpdate(
      {
        _id: invitationId,
        inviteeEmail: user.email.toLowerCase(),
        status: "pending",
      },
      {
        $set: {
          status: "rejected",
        },
      },
      { returnDocument: "after" },
    );

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Pending invitation not found or already processed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Invitation rejected successfully",
    });
  } catch (error) {
    console.error("Reject Invitation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject invitation",
    });
  }
};
