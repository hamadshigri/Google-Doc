import mongoose from "mongoose"

const documentSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Untitled document",
        trim: true
    },
    content: {
        type: String,
        default: "",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {timestamps: true},
)

const Document = mongoose.model("Document", documentSchema);

export default Document;