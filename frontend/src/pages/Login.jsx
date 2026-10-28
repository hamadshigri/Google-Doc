import { useRef } from "react"
import Navbar from "../components/Navbar"
import { login } from "../lib/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeroText from "../components/HeroText";

const Login = () => {

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const loginNotify = () => toast("User LoggedIn Successfully!");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const data = {
            email, password
        }
        try {
            const response = await login(data);
            localStorage.setItem("token", response.data.token);
            navigate(location.state?.from?.pathname || "/", { replace: true });
            loginNotify();
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center h-[70vh] gap-4">
                <HeroText />
                <div className="max-w-[500px] w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center border border-gray-400 rounded-md p-8">
                        <input type="email" ref={emailRef} placeholder="Enter your email" className="rounded border border-gray-500 p-2" />
                        <input type="password" ref={passwordRef} placeholder="Enter your password" className="rounded border border-gray-500 p-2" />
                        <button type="submit" className="bg-[#3186FF] hover:bg-[#3186ffb8] text-white cursor-pointer text-xl p-2 font-bold rounded-md">Login</button>
                        <p className="text-center">Don't have an Account? <Link to="/register" className="text-[#3186FF] font-bold">Register</Link></p>

                    </form>
                </div>
            </div>

        </>
    )
}

export default Login
