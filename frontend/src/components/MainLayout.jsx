import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import { Menu } from "lucide-react";

const MainLayout = () => {
  const [leftSideBar, setLeftSideBar] = useState(true);
  return (
    <div className="bg-black text-white">
      <div className="flex justify-center items-center align-middle">
        <Menu
          size={40}
          className="absolute top-4 left-6 z-20 md:hidden"
          onClick={() => setLeftSideBar(!leftSideBar)}
        />
        <img src="../unite.svg" alt="logo" className=" mx-auto mt-4" />
      </div>
      {leftSideBar && <LeftSidebar />}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
