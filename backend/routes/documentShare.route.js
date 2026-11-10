import express from "express";
import { acceptInvitation, createDocumentInvitation, getInvitationDetails, rejectInvitation } from "../controllers/documentShare.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:id/invitations", verifyAuthentication, createDocumentInvitation);
router.get("/invitations/:invitationId", verifyAuthentication, getInvitationDetails);
router.post("/invitations/:invitationId/accept",verifyAuthentication, acceptInvitation);
router.post("/invitations/:invitationId/reject",verifyAuthentication, rejectInvitation);

export default router;