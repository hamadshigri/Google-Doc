import { IoMdSearch } from "react-icons/io";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setSearchTerm }) => {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isHomePage = pathname === "/";

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    }
    return (
        <>
            <div className="bg-white py-4 flex justify-center items-center w-full">
                <div className="flex justify-between items-center w-full max-w-[80%]">

                    <div
                        className="flex items-center text-2xl font-normal cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="w-10 h-10 mr-2"
                        />
                        <span>Docs</span>
                    </div>

                    {isHomePage && (
                        <div className="flex items-center rounded-full bg-[#F0F4F9] px-4">
                            <IoMdSearch className="w-6 h-6 text-gray-600" />

                            <input
                                type="text"
                                className="w-[600px] rounded-full bg-[#F0F4F9] px-4 py-3 border-none focus:outline-none"
                                onChange={(e) =>
                                    setSearchTerm?.(e.target.value)
                                }
                                placeholder="Search"
                            />
                        </div>
                    )}

                    <div>
                        <Button
                            onClick={
                                isLoggedIn
                                    ? logout
                                    : () => navigate("/login")
                            }
                            name={isLoggedIn ? "Logout" : "Login"}
                        />
                    </div>

                </div>
            </div>

        </>
    )
}

export default Navbar