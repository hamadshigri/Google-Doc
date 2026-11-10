import Document from "../models/document.model.js";
import DocumentShare from "../models/documentShare.model.js";

export const checkDocumentAccess = (requiredRole="viewer") => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user;

            const document = await Document.findById(id);

            if(!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                })
            }

            if(document.user.toString() === userId.toString()) {
                req.document = document;
                req.documentRole = "owner";
                return next();
            }

            const share = await DocumentShare.findOne({
                document: id,
                invitedUser: userId,
                status: "accepted"
            });

            if(!share) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have access to this document"
                })
            }

            if(requiredRole === "owner") {
                return res.status(403).json({
                    success: false,
                    message: "Only the document owner can perform this action"
                })
            }

            if(requiredRole === "editor" && share.role !== "editor") {
                return res.status(403).json({
                    successs: false,
                    message: "You do not have permission to edit this document"
                })
            }

            req.document = document;
            req.documentRole = share.role;

            next();
        } catch (error) {
            console.error("Document Access Error: ", error);
            
            return res.status(500).json({
                success: false,
                message: "Failed to verify document access"
            })
        }
    }
}