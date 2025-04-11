import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetHomePosts from "@/hooks/useGetHomePosts";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const MainLayout = () => {
  return (
    <div className="bg-zinc-900 text-white">
      <div className="flex justify-center items-center align-middle h-16">
        <img src="../unite.svg" alt="logo" className=" mx-auto mt-4" />
      </div>
   
        <LeftSidebar />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
