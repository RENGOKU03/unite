import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();
  const followUnfollow = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/user/${userId}/profile`,
            { withCredentials: true }
          );
          if (res.data.success) {
            dispatch(setUserProfile(res.data.user));
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

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex justify-center mx-auto ml-[20%] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-20 p-8 mt-4 w-screen">
        <div className="md:flex gap-10">
          <section className="flex items-center justify-center overflow-hidden md:w-1/3">
            <Avatar className="h-32 w-32 md:h-52 md:w-52">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback className="text-black">CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="overflow-hidden mt-4 mx-auto md:mx-0">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 justify-between">
                <span className="items-start">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-blue-200 h-8 bg-blue-400"
                      >
                        Edit profile
                      </Button>
                    </Link>
                  </>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      className="h-8 bg-red-400 hover:bg-red-500"
                      onClick={() => followUnfollow(userProfile._id)}
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 bg-gray-400 hover:bg-gray-500"
                    >
                      Message
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                    onClick={() => followUnfollow(userProfile._id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200 ">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
