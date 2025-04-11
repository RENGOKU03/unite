import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return null;
  }

  return (
    <div className="w-72 ml-16 md:my-6 pr-4 md:block md:mr-6 sticky top-20">
      {/* User Profile Card */}
      <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user?._id}`} className="relative group">
            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-gray-800 group-hover:ring-blue-900 transition-all duration-200">
              <AvatarImage
                src={user?.profilePicture}
                alt={`${user?.username}'s profile picture`}
              />
              <AvatarFallback className="bg-gray-700 text-blue-400">
                {user?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-300"></div>
          </Link>
          <div className="overflow-hidden">
            <h1 className="font-semibold text-base text-gray-100">
              <Link
                to={`/profile/${user?._id}`}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {user?.username}
              </Link>
            </h1>
            <p className="text-gray-400 text-sm truncate max-w-xs">
              {user?.bio || "No bio available"}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <Link
            to={`/profile/${user?._id}`}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex justify-center"
          >
            View full profile
            <svg
              className="h-4 w-4 ml-1 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </Link>
        </div>
      </div>

      {/* Suggested Users Component */}
      <SuggestedUsers user={user} />

      {/* Footer Links */}
      <div className="mt-6 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            About
          </a>
          <span>•</span>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Help
          </a>
          <span>•</span>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Privacy
          </a>
          <span>•</span>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Terms
          </a>
        </div>
        <p className="mt-2">© 2025 Unite • All Rights Reserved</p>
      </div>
    </div>
  );
};

export default RightSidebar;
