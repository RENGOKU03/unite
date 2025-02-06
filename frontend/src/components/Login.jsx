import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Loader2, MoveRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordType, setPasswordType] = useState("password");

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center">
      <div className="grid grid-cols-2 h-3/4 w-3/4 mx-auto shadow-lg bg-white overflow-hidden rounded-3xl">
        <div className="rounded-3xl mx-10">
          <form onSubmit={signupHandler} className="flex flex-col gap-5 p-8">
            <div className="my-4">
              <img src="../unite.svg" alt="logo" className="m-auto" />
              <p className="text-sm text-center">
                Login to see photos & videos from your friends
              </p>
            </div>
            <div>
              <span className="font-medium">Email</span>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2 bg-blue-100"
              />
            </div>
            <div className="relative">
              <span className="font-medium">Password</span>
              <Input
                type={passwordType}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2 bg-blue-100"
              />
              <Eye
                className="absolute top-[52px] right-4 -translate-y-1/2 text-pink-500 cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() =>
                  setPasswordType(
                    passwordType === "password" ? "text" : "password"
                  )
                }
                size={20}
              />
            </div>
            {loading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <button
                type="submit"
                className=" bg-pink-900 py-3 px-5 rounded-full mx-auto text-white flex gap-4 items-center justify-center"
              >
                Login
                <MoveRight />
              </button>
            )}

            <span className="text-center">
              Don't have an account yet?{" "}
              <Link to="/signup" className="text-pink-600 font-semibold">
                Signup for free
              </Link>
            </span>
          </form>
        </div>
        <div className="hidden overflow-hidden md:flex items-center justify-center">
          <img
            src="../login.png"
            alt="login"
            className="hidden md:block object-cover object-center max-w-full max-h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
