import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    // Username validation
    if (!input.username.trim()) {
      newErrors.username = "*** Username is required ***";
    } else if (input.username.length < 3) {
      newErrors.username =
        "*** Username must be at least 3 characters long ***";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email.trim()) {
      newErrors.email = "*** Email is required ***";
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = "*** Invalid email format ***";
    }

    // Password validation
    if (!input.password.trim()) {
      newErrors.password = "*** Password is required ***";
    } else if (input.password.length < 8) {
      newErrors.password =
        "*** Password must be at least 8 characters long ***";
    } else if (!/[A-Z]/.test(input.password)) {
      newErrors.password =
        "*** Password must contain at least one uppercase letter ***";
    } else if (!/[0-9]/.test(input.password)) {
      newErrors.password = "*** Password must contain at least one number ***";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://unite-dd7d.onrender.com/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
        console.log(res.data);
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
      <div className="md:grid md:grid-cols-2 h-[95%] w-3/4 mx-auto shadow-lg bg-white overflow-hidden rounded-3xl">
        <div className="rounded-3xl md:mx-10">
          <form onSubmit={signupHandler} className="flex flex-col gap-5 p-8">
            <div className="my-4">
              <img src="../unite.svg" alt="logo" className="m-auto" />
              <p className="text-sm text-center">
                Signup to see photos & videos from your friends
              </p>
            </div>
            <div>
              <span className="font-medium flex items-center gap-4">
                Username{" "}
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </span>
              <Input
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2 bg-blue-100"
              />
            </div>
            <div>
              <span className="font-medium flex items-center gap-4">
                Email{" "}
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </span>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2 bg-blue-100"
              />
            </div>
            <div className="relative">
              <span className="font-medium flex items-center gap-4">
                Password{" "}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </span>{" "}
              <div className="flex items-center">
                <Input
                  type={passwordType}
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-transparent my-2 bg-blue-100"
                />
                <Eye
                  className="absolute right-4 text-pink-500 cursor-pointer hover:scale-110 transition-all duration-300"
                  onClick={() =>
                    setPasswordType(
                      passwordType === "password" ? "text" : "password"
                    )
                  }
                  size={20}
                />
              </div>
            </div>
            {loading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <button
                type="submit"
                className=" bg-pink-900 px-5 py-2 rounded-full mx-auto text-white flex gap-4 items-center justify-center cursor-pointer hover:bg-pink-700 active:scale-95 transition-all duration-300 "
              >
                Signup
              </button>
            )}
            <span className="text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 font-semibold">
                Login
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

export default Signup;
