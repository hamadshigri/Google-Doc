import { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../App.css";
import Button from "./Button";
import { createDocument, getDocumentById, updateDocument } from "../lib/document";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";

const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = ["10px", "12px", "14px", "16px", "18px", "24px", "32px"];
Quill.register(SizeStyle, true);

const formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "list",
  "link",
  "blockquote",
];

export default function RichTextEditor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled document");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();

  const addNotify = () => toast("✅ Document Saved!");
  const updateNotify = () => toast("✅ Document Updated!");
  const emptyNotify = () => toast("❌ Please add text in the title or content");


  const { id } = params;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;
    const loadDocument = async () => {
      try {
        const response = await getDocumentById(id, token);
        const document = response.data;
        setTitle(document.title ?? "Untitle document");
        setContent(document.content ?? "")
      } catch (error) {
        setError(error.response?.data?.message ?? "Could not load the document")
      }
    }

    loadDocument();

  }, [id])

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }, { size: [false, "10px", "12px", "14px", "16px", "18px", "24px", "32px"] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }, "blockquote", "link"],
        ["clean"],
      ],
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  const executeSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      if (
        !title ||
        !content ||
        title.trim().length === 0 ||
        content.trim().length === 0
      ) return emptyNotify();
      const response = await createDocument({ title, content }, token);
      const savedDocument = response.data.document;
      addNotify();
    } catch (error) {
      setError(error.response?.data?.message ?? "Could not save the document");
    } finally {
      setSaving(false);
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    await executeSubmit();
  }

  const handleUpdate = async () => {
    setSaving(true);
    if (!id) return;
    try {
      if (
        !title ||
        !content ||
        title.trim().length === 0 ||
        content.trim().length === 0
      ) return emptyNotify();
      const response = await updateDocument(id, { title, content }, token);
      updateNotify();
    } catch (error) {
      setError(error.response?.data?.message ?? "Could not update the document");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();

        if (id) {
          handleUpdate();
        } else {
          handleSubmit();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, title, content, token]);

  return (
    <div className="document-container">
      {error && <div className="text-red p-3">{error}</div>}
      <header className="document-header">
        <div className="flex items-center gap-4">
          <Link to="/"><IoArrowBack className="text-2xl" /></Link>
          <input
            className="document-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Document title"
          />
        </div>
        {(id) ? <Button name="Update" onClick={handleUpdate} /> : <Button name={saving ? "Saving..." : "Save"} onClick={handleSubmit} />}
      </header>

      <div className="document-editor">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Type here... Press Ctrl+S to save changes."
        />
      </div>
    </div>
  );
}
