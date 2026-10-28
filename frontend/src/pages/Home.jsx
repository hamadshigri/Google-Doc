import Navbar from "../components/Navbar"
import Document from "../components/Document"
import { deleteDocument, getAllDocument } from "../lib/document"
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { handleConfirmation } from "../utils/SwalHelper.js";
import { Link } from "react-router-dom"



const Home = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        setIsLoggedIn(true);

        const loadDocuments = async () => {
            const response = await getAllDocument(token);
            const data = response.data.documents;
            setDocuments(data);
        }
        loadDocuments();

    }, [])

    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();

        if(!term) {
            setFilteredDocuments(documents);
            return;
        }
        setFilteredDocuments(documents.filter((document) => document.title?.toLowerCase().includes(term)));
    }, [documents, searchTerm]);

    const handleDelete = async (documentId) => {
        try {
            const result = await handleConfirmation(
                "Delete Item?",
                "This action cannot be undone."
            );
            if (result.isConfirmed) {
                await deleteDocument(documentId, token);
                setDocuments((current) => current.filter((doc) => doc._id !== documentId));
                Swal.fire({
                    title: "Deleted!",
                    text: "Your item has been successfully removed.",
                    icon: "success",
                    confirmButtonColor: '#437993'
                });
            }
        } catch (error) {
            console.log("Could not delete document:", error);
        }
    }
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} setSearchTerm={setSearchTerm} />
            <div className="flex justify-center bg-[#F0F4F9]">
                <div className="w-full max-w-[900px] py-4">
                    <h3 className="mb-4 font-normal">Start a new document</h3>
                    <div className="flex flex-col gap-2 ">
                        <Link to={"/document"} className="inline-fit"><img src="./docs-blank.png" alt="docs-blank" className="w-[140px] h-[180px] rounded border border-[#c4c7c5] hover:border-[#0b57d0] cursor-pointer" /></Link>
                        <p className="text-sm font-medium px-2">Blank document</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-[900px] py-4">
                    <h3 className="mb-4 font-normal">Recent documents</h3>
                    <div className="flex flex-wrap gap-4">
                        {
                            filteredDocuments.map((d) => (
                                <Document key={d._id} documentId={d._id} title={d.title} content={d.content} createdAt={d.createdAt} onDelete={handleDelete} />
                            ))
                        }
                    </div>
                </div>
            </div>


        </>
    )
}

export default Home