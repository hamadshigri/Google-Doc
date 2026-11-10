import { useRef } from "react";
import Navbar from "../components/Navbar";
import { login } from "../lib/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeroText from "../components/HeroText";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";


const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            const response = await login({ email, password });

            localStorage.setItem("token", response.data.token);

            toast.success("User logged in successfully!");

            const from = location.state?.from;

            navigate(
                from
                    ? {
                        pathname: from.pathname,
                        search: from.search,
                        hash: from.hash
                    }
                    : "/",
                { replace: true }
            );

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed!"
            );
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex justify-center items-center h-[70vh] gap-4">
                <HeroText />

                <div className="max-w-[500px] w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 justify-center p-8 border-l border-solid border-blue-500"
                    >
                        <input
                            type="email"
                            ref={emailRef}
                            required
                            placeholder="Enter your email"
                            className="rounded border border-gray-500 p-2"
                        />

                        <div className="flex justify-between rounded border border-gray-500 pr-1">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            ref={passwordRef}
                            required
                            placeholder="Enter your password"
                            className="p-2 w-full focus:outline-none"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                        {
                            showPassword ? <FaEye /> : <FaEyeSlash />
                        }
                        </button>
                        
                   
                        </div>

                        <button
                            type="submit"
                            className="bg-[#3186FF] hover:bg-[#3186ffb8] text-white cursor-pointer text-xl p-2 font-bold rounded-md"
                        >
                            Login
                        </button>

                        <p className="text-center">
                            Don't have an Account?{" "}
                            <Link
                                to="/register"
                                className="text-[#3186FF] font-bold"
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
