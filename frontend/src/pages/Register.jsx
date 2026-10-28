import { useRef } from "react"
import Navbar from "../components/Navbar"
import { register } from "../lib/user";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeroText from "../components/HeroText";

const Register = () => {

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const registerNotify = () => toast("User Registered Successfully!");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const data = {
            name, email, password
        }
        try {
            const response = await register(data);
            console.log("User Registered!", response);
            navigate("/login");
            registerNotify();
        } catch (error) {
            console.log(error.message);
        }

    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center h-[80vh] gap-4">
                <HeroText />
                <div className="max-w-[500px] w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center border border-gray-400 rounded-md p-8">
                        <input type="text" ref={nameRef} placeholder="Enter your name" className="rounded border border-gray-500 p-2" />
                        <input type="email" ref={emailRef} placeholder="Enter your email" className="rounded border border-gray-500 p-2" />
                        <input type="password" ref={passwordRef} placeholder="Enter your password" className="rounded border border-gray-500 p-2" />
                        <button type="submit" className="bg-[#3186FF] hover:bg-[#3186ffb8] text-white cursor-pointer text-xl p-2 font-bold rounded-md">Register</button>
                        <p className="text-center">Already have an Account? <Link to="/login" className="text-[#3186FF] font-bold">Login</Link></p>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Register