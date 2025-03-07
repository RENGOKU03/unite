import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    bio: "",
    gender: "",
    profilePhoto: "",
  });

  const validateForm = () => {
    var isValid = true;
    const newErrors = {
      bio: "",
      gender: "",
      profilePhoto: "",
    };

    if (!input.bio?.trim()) {
      newErrors.bio = "Bio is required";
      isValid = false;
    }
    if (!input.gender?.trim()) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-2">
            <Link to={`/profile/${user?._id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>

          {/* Profile info card */}
          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 border-2 border-indigo-500">
                  <AvatarImage
                    src={
                      typeof input.profilePhoto === "string"
                        ? input.profilePhoto
                        : user?.profilePicture
                    }
                    alt="profile_image"
                  />
                  <AvatarFallback className="bg-gray-700 text-indigo-300">
                    {user?.username?.substring(0, 2).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
                <div
                  onClick={() => imageRef?.current.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer"
                >
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold">{user?.username}</h1>
                <span className="text-gray-400 text-sm">
                  {typeof input.profilePhoto !== "string"
                    ? "New photo selected"
                    : "Click avatar to change photo"}
                </span>
              </div>
            </div>
            <input
              ref={imageRef}
              onChange={fileChangeHandler}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <Button
              onClick={() => imageRef?.current.click()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Change photo
            </Button>
          </div>

          {/* Bio section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="font-bold text-lg mb-3">Bio</h2>
            <Textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              name="bio"
              placeholder="Tell us about yourself..."
              className="focus-visible:ring-indigo-500 bg-gray-700 border-gray-600 placeholder:text-gray-500 min-h-32 text-white"
            />
            {errors.bio && (
              <p className="mt-1 text-red-400 text-sm">{errors.bio}</p>
            )}
          </div>

          {/* Gender selection */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="font-bold text-lg mb-3">Gender</h2>
            <Select
              defaultValue={input.gender}
              onValueChange={selectChangeHandler}
            >
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:ring-indigo-500">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectGroup>
                  <SelectItem value="male" className="hover:bg-gray-700">
                    Male
                  </SelectItem>
                  <SelectItem value="female" className="hover:bg-gray-700">
                    Female
                  </SelectItem>
                  <SelectItem value="other" className="hover:bg-gray-700">
                    Other
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="mt-1 text-red-400 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end mt-2">
            {loading ? (
              <Button
                disabled
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating profile...
              </Button>
            ) : (
              <Button
                onClick={editProfileHandler}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
