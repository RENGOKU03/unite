import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetHomePosts from "@/hooks/useGetHomePosts";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  useGetHomePosts();
  return (
    <div className="flex bg-black text-white">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
