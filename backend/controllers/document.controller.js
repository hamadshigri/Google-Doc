import Document from "../models/document.model.js";
import DocumentShare from "../models/documentShare.model.js";

export const createDocument = async (req, res) => {
  try {
    const { title, content = "" } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please add the valid document title",
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid document content",
      });
    }

    const document = await Document.create({
      title: title.trim(),
      content,
      user: req.user,
    });

    return res.status(201).json({ success: true, document });
  } catch (error) {
    console.error("Create Document Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create document" });
  }
};

export const getDocument = async (req, res) => {
  try {
    const userId = req.user;

    const sharedDocuments = await DocumentShare.find({
      invitedUser: userId,
      status: "accepted",
    });

    const sharedDocumentIds = sharedDocuments.map((share) => share.document);

    const documents = await Document.find({
      $or: [{ user: userId }, { _id: { $in: sharedDocumentIds } }],
    }).sort({ updatedAt: -1 });

    const documentWithRole = documents.map((document) => {
      const isOwner = document.user.toString() === userId.toString();

      const share = sharedDocuments.find(
        (item) => item.document.toString() === document._id.toString(),
      );

      return {
        ...document.toObject(),
        role: isOwner ? "owner" : share.role,
      };
    });

    return res.status(200).json({
      success: true,
      documents: documentWithRole,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch documents" });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      document: req.document,
      role: req.documentRole,
    });
  } catch (error) {
    console.error("Get Document Error:", error);
    return res
      .status(500)
      .json({ sucess: false, message: "Failed to fetch document" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        success: true,
        message: "Document title cannot be empty",
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid document content",
      });
    }

    req.document.title = title.trim();
    req.document.content = content;

    const updatedDocument = await req.document.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Document Updated Succesfully!",
        document: updatedDocument,
      });
  } catch (error) {
    console.error("Update Document Error:", error);

    return res
      .status(500)
      .json({ success: false, message: "Failed to update document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = req.document;

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete Document Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete document" });
  }
};
