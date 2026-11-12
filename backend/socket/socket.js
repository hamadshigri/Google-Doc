import mongoose from "mongoose";
import Document from "../models/document.model.js";
import DocumentShare from "../models/documentShare.model.js";

import { socketAuthentication } from "../middlewares/socketAuth.middleware.js";

const initializeSocket = (io) => {
  io.use(socketAuthentication);

  io.on("connection", (socket) => {
    console.log("Authenticated user connected:", socket.userId);

    socket.on("join-document", async (documentId, callback) => {
      const respond = typeof callback === "function" ? callback : () => {};

      try {
        if (!mongoose.isValidObjectId(documentId)) {
          return respond({
            success: false,
            message: "Invalid document ID",
          });
        }

        const document = await Document.findById(documentId);

        if (!document) {
          return respond({
            success: false,
            message: "Document not found",
          });
        }

        let role;

        if (document.user.toString() === socket.userId.toString()) {
          role = "owner";
        } else {
          const share = await DocumentShare.findOne({
            document: documentId,
            invitedUser: socket.userId,
            status: "accepted",
          });

          if (!share) {
            return respond({
              success: false,
              message: "You do not have access to this document",
            });
          }

          role = share.role;
        }

        const room = `document:${documentId}`;

        await socket.join(room);

        socket.data.documentRoles ??= {};
        socket.data.documentRoles[documentId] = role;

        console.log(`User ${socket.userId} joined ${room} as ${role}`);

        respond({
          success: true,
          message: "Joined document successfully",
          documentId,
          role,
        });
      } catch (error) {
        console.error("Join Document Error:", error);

        respond({
          success: false,
          message: "Failed to join document",
        });
      }
    });

    socket.on("document-update", async (data, callback) => {
      const respond = typeof callback === "function" ? callback : () => {};

      try {
        const { documentId, content } = data || {};

        if (
          !mongoose.isValidObjectId(documentId) ||
          typeof content !== "string" ||
          content.length > 100000
        ) {
          return respond({
            success: false,
            message: "Invalid document update",
          });
        }

        const room = `document:${documentId}`;

        if (!socket.rooms.has(room)) {
          return respond({
            success: false,
            message: "You have not joined this document",
          });
        }

        const document = await Document.findById(documentId);

        if (!document) {
          return respond({
            success: false,
            message: "Document not found",
          });
        }

        const isOwner = document.user.toString() === socket.userId.toString();

        if (!isOwner) {
          const share = await DocumentShare.findOne({
            document: documentId,
            invitedUser: socket.userId,
            status: "accepted",
            role: "editor",
          });

          if (!share) {
            return respond({
              success: false,
              message: "You do not have permission to edit",
            });
          }
        }

        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            {
                $set: { content },
            },
            {
                returnDocument: 'after',
                runValidators: true,
            }
        ).select("_id updatedAt");

        if(!updatedDocument) {
            return respond({
                success: false,
                message: "Failed to save document",
            })
        }

        socket.to(room).emit("document-changed", {
          documentId,
          content,
          updatedBy: socket.userId,
        });

        respond({
          success: true,
          message: "Document saved and broadcast successfully",
          updatedAt: updatedDocument.updatedAt,
        });
      } catch (error) {
        console.error("Document Update Error:", error);
        respond({
          success: false,
          message: "Failed to broadcast document update",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
};

export default initializeSocket;