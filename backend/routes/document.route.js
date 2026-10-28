import express from "express";
import { createDocument, deleteDocument, getDocument, getDocumentById, updateDocument } from "../controllers/document.controller.js";

const router = express.Router();


router.post("/", createDocument);
router.get("/", getDocument);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;