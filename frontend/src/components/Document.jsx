import { LuUsers } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDisplayDate } from "../utils/DateTime.js";
import { Link } from "react-router-dom";


const Document = ({ title, content, createdAt, documentId, onDelete }) => (
    <div className="w-[200px] h-[250px] overflow-hidden rounded border border-[#c4c7c5] bg-white hover:border-[#0b57d0]">
        <div className="h-full p-3">
            <Link to={`/document/${documentId}`}>
            <div>
                <h4 className="mb-2 truncate text-center font-medium">
                    {title || "Untitled document"}
                </h4>

                <div
                    className="h-[150px] overflow-hidden text-[8px] whitespace-normal break-words" style={{ overflowWrap: "anywhere" }}
                    dangerouslySetInnerHTML={{ __html: content || "" }}
                />
            </div>
            </Link>
            <div className="flex justify-between z-40 border-t border-gray-300 items-center">
                <div className="flex items-center gap-2 py-4">
                    <img src="./logo.png" alt="logo" className="w-4 h-4" />
                    <LuUsers />
                    <span className="text-xs">{formatDisplayDate(createdAt)}</span>
                </div>
                <RiDeleteBin6Line className="text-red-500 cursor-pointer" onClick={() => onDelete(documentId)}/>
            </div>
            <div>

            </div>

        </div>
    </div>
);

export default Document;