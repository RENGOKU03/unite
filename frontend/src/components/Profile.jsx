import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AtSign,
  Heart,
  MessageCircle,
  Edit,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";
import { useEffect } from "react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();
  const [uProfile, setUProfile] = useState(null);

  const followUnfollow = async (userId) => {
    try {
      const response = await axios.post(
        `https://unite-dd7d.onrender.com/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        try {
          const res = await axios.get(
            `https://unite-dd7d.onrender.com/api/v1/user/${userId}/profile`,
            { withCredentials: true }
          );
          if (res.data.success) {
            setUProfile(res.data.user);
            console.log("profile dispatched");
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error);
    }
  };

  useEffect(() => {
    const getUProfile = async (userId) => {
      try {
        const res = await axios.get(
          `https://unite-dd7d.onrender.com/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        console.log(res.data.user);

        if (res.data.success) {
          console.log(res.data.user);
          setUProfile(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUProfile(userId);
  }, [userId, dispatch]);

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === uProfile?._id;
  const isFollowing = uProfile?.followers?.includes(user._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? uProfile?.posts : uProfile?.bookmarks;

  return (
    <div className="flex justify-center  min-h-screen bg-gray-900 text-gray-100 ml-10">
      <div className="flex flex-col gap-8 p-4 md:p-8 w-full max-w-6xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 p-6 rounded-xl bg-gray-800 shadow-lg">
          {/* Avatar */}
          <section className="flex items-center justify-center overflow-hidden">
            <Avatar className="h-32 w-32 md:h-48 md:w-48 border-2 border-indigo-400 shadow-md">
              <AvatarImage src={uProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback className="bg-gray-700 text-indigo-300">
                {uProfile?.username?.substring(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Info */}
          <section className="flex flex-col gap-5 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <span className="text-xl md:text-2xl font-bold">
                {uProfile?.username}
              </span>

              <div className="flex gap-2">
                {isLoggedInUserProfile ? (
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    >
                      <Edit size={16} /> Edit profile
                    </Button>
                  </Link>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      className="h-10 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => followUnfollow(uProfile._id)}
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-10 bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                    >
                      <MessageSquare size={16} /> Message
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="h-10 bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={() => followUnfollow(uProfile._id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between md:justify-start md:gap-8 p-4 bg-gray-700 rounded-lg">
              <div className="text-center">
                <p className="font-bold text-xl text-indigo-300">
                  {uProfile?.posts?.length || 0}
                </p>
                <p className="text-sm text-gray-400">posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-indigo-300">
                  {uProfile?.followers?.length || 0}
                </p>
                <p className="text-sm text-gray-400">followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-indigo-300">
                  {uProfile?.following?.length || 0}
                </p>
                <p className="text-sm text-gray-400">following</p>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2 p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-100">
                {uProfile?.bio || "bio here..."}
              </span>
              <Badge className="w-fit bg-gray-600 text-indigo-300 flex items-center">
                <AtSign size={14} />
                <span className="pl-1">{uProfile?.username}</span>
              </Badge>
            </div>
          </section>
        </div>

        {/* Tabs and Posts */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center justify-center border-b border-gray-700">
            <button
              className={`px-6 py-4 transition-all ${
                activeTab === "posts"
                  ? "font-bold border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </button>
            <button
              className={`px-6 py-4 transition-all ${
                activeTab === "saved"
                  ? "font-bold border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </button>
          </div>

          {/* Posts Grid */}
          <div className="p-4">
            {displayedPost?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {displayedPost?.map((post) => (
                  <div
                    key={post?._id}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      src={post.image}
                      alt="postimage"
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-6">
                        <div className="flex items-center gap-2">
                          <Heart size={20} className="text-red-400" />
                          <span>{post?.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle
                            size={20}
                            className="text-indigo-400"
                          />
                          <span>{post?.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                No {activeTab === "posts" ? "posts" : "saved content"} yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
