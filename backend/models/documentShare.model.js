import mongoose from "mongoose";

const documentShareSchema = mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    inviteeEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    invitedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    role: {
        type: String,
        enum: ["editor", "viewer"],
        default: "editor"
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "revoked"],
        default: "pending"
    }
}, {timestamps: true});


const DocumentShare = mongoose.model("DocumentShare", documentShareSchema);

export default DocumentShare;