import { useEffect, useMemo, useState, useRef } from "react";
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
import ShareModal from "./ShareModal";
import { FaShareFromSquare } from "react-icons/fa6";
import { createSocketConnection } from "../socket/socket";


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
  const socketRef = useRef(null);
  const isJoinedRef = useRef(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const addNotify = () => toast("Document Saved!");
  const updateNotify = () => toast("Document Updated!");
  const emptyNotify = () =>
    toast("Please add text in the title or content");


  useEffect(() => {
    if (!token || !id) {
      return;
    }
    const socket = createSocketConnection(token);

    socketRef.current = socket;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      isJoinedRef.current = false;

      socket.emit("join-document", id, (response) => {
        if (response.success) {
          isJoinedRef.current = true;
          console.log("Joined document:", response);
        } else {
          console.log("Failed to join:", response.message);
        }
      })
    }


    const handleDocumentChanged = (data) => {
      if (data.documentId !== id) return;

      setContent(data.content);
    };

    socket.on("connect", handleConnect);

    socket.on("document-changed", handleDocumentChanged);

    socket.on("disconnect", () => {
      isJoinedRef.current = false;
    })

    socket.on("connect_error", (error) => {
      console.log("Socket authentication failed:", error.message);
    });

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("document-changed", handleDocumentChanged);
      socket.disconnect();

      socketRef.current = null;
      isJoinedRef.current = false;
    }
  }, [id, token]);


  const handleContentChange = (value, delta, source, editor) => {
    setContent(value);

    if (source !== "user") return;

    if (!id || role === "viewer") return;

    if (!isJoinedRef.current) return;

    socketRef.current?.emit(
      "document-update",
      {
        documentId: id,
        content: value
      },
      (response) => {
        if (!response?.success) {
          console.log("Document update failed:", response?.message);
        }
      }
    )
  }


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
      keyboard: {
        bindings: {
          enter: {
            key: 'Enter',
            handler: function (range, context) {
              const formats = quill.getFormat(range);

              this.quill.insertText(range.index, '\n', 'user');

              this.quill.setSelection(range.index + 1, 'silent');

              Object.keys(formats.length ? formats : {}).forEach((name) => {
                this.quill.format(name, formats[name]);
              });

              return false;
            }
          }
        }
      }
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

    if (!titleChanged && !contentChanged) {
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
                  <FaShareFromSquare
                    onClick={() =>
                      setShowShareModal(true)
                    }
                    className="cursor-pointer text-2xl"
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
                onChange={handleContentChange}
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
