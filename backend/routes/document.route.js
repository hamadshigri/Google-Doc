import express from "express";
import { createDocument, deleteDocument, getDocument, getDocumentById, updateDocument } from "../controllers/document.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import { checkDocumentAccess } from "../middlewares/checkDocumentAccess.js";

const router = express.Router();


router.post("/", verifyAuthentication, createDocument);
router.get("/", verifyAuthentication, getDocument);
router.get("/:id", verifyAuthentication, checkDocumentAccess("viewer"), getDocumentById);
router.put("/:id", verifyAuthentication, checkDocumentAccess("editor"), updateDocument);
router.delete("/:id", verifyAuthentication, checkDocumentAccess("owner"), deleteDocument);

export default router;