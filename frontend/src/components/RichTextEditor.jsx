import { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../App.css";
import Button from "./Button";
import {
  createDocument,
  getDocumentById,
  updateDocument,
} from "../lib/document";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import ShareModal from "./ShareModal";

const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "24px",
  "32px",
];
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const addNotify = () => toast("Document Saved!");
  const updateNotify = () => toast("Document Updated!");
  const emptyNotify = () =>
    toast("Please add text in the title or content");


  useEffect(() => {
    if (!id) {
      setRole("owner");
      return;
    }

    const loadDocument = async () => {
      setLoading(true);
      setError("");
      setRole("");

      try {
        const response = await getDocumentById(id, token);
        const document = response.data.document;

        setTitle(document.title ?? "Untitled document");
        setContent(document.content ?? "");

        setOriginalTitle(document.title ?? "Untitled document");
        setOriginalContent(document.content ?? "");

        setRole(response.data.role);
      } catch (error) {
        setError(
          error.response?.data?.message ??
            "Could not load the document"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, token]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [
          { header: [1, 2, 3, false] },
          {
            size: [
              false,
              "10px",
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "32px",
            ],
          },
        ],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          "blockquote",
          "link",
        ],
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


  const normalizeContent = (value) => {
  return value
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};


  const executeSubmit = async () => {
    if (saving || loading) return;

    setSaving(true);
    setError("");

    try {
      if (!title.trim() || !normalizeContent(content)) {
        emptyNotify();
        return;
      }

      const response = await createDocument(
        { title, content },
        token
      );

      const savedDocument = response.data.document;

      addNotify();

      navigate(`/document/${savedDocument._id}`, {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ??
          "Could not save the document"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    await executeSubmit();
  };

  const handleUpdate = async () => {
    if (!id || saving || loading || role === "viewer") return;


    const titleChanged = title.trim() !== originalTitle.trim();
    const contentChanged = normalizeContent(content) !== normalizeContent(originalContent);

    if(!titleChanged && !contentChanged) {
      toast.info("No changes detected!");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (!title.trim() || !content.trim()) {
        emptyNotify();
        return;
      }

      await updateDocument(id, { title, content }, token);

      setOriginalTitle(title);
      setOriginalContent(content);

      updateNotify();
    } catch (error) {
      setError(
        error.response?.data?.message ??
          "Could not update the document"
      );
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();

        if (id) {
          handleUpdate();
        } else {
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [id, title, content, token, role, saving, loading]);

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="document-container">
        {error && (
          <div className="text-red p-3">{error}</div>
        )}

        {loading ? (
          <p className="text-center p-5">
            Loading document...
          </p>
        ) : (
          <>
            <header className="document-header">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <IoArrowBack className="text-2xl" />
                </Link>

                <input
                  className="document-title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  disabled={role === "viewer"}
                  aria-label="Document title"
                />
              </div>

              <div className="flex items-center gap-3">
                {id && role === "owner" && (
                  <Button
                    name="Share"
                    onClick={() =>
                      setShowShareModal(true)
                    }
                  />
                )}

                {id && role !== "viewer" && (
                  <Button
                    name={
                      saving ? "Updating..." : "Update"
                    }
                    disabled={saving || loading}
                    onClick={handleUpdate}
                  />
                )}

              
                {!id && (
                  <Button
                    name={saving ? "Saving..." : "Save"}
                    disabled={saving || loading}
                    onClick={handleSubmit}
                  />
                )}
              </div>
            </header>

            <div className="document-editor">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                readOnly={role === "viewer"}
                placeholder="Type here... Press Ctrl+S to save changes."
              />
            </div>

            {showShareModal && id && role === "owner" && (
              <ShareModal
                documentId={id}
                onClose={() =>
                  setShowShareModal(false)
                }
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
