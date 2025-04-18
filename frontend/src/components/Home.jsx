import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetHomePosts from "@/hooks/useGetHomePosts";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((store) => store.auth);
  useGetAllPost();
  useGetSuggestedUsers();
  useGetHomePosts();
  {
    user && useGetUserProfile(user._id);
  }
  return (
    <div className="flex flex-col-reverse md:flex-row bg-zinc-900 text-white">
      <div className="flex-grow ml-16 mr-4">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
