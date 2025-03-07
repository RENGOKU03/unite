import { Menu, Search, Users, X } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import useGetAllUsers from "@/hooks/useGetAllUsers";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  useGetAllUsers();
  const { allUsers } = useSelector((store) => store.auth);
  const { isLoading, error } = useGetAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredUsers = allUsers?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-zinc-900 to-black text-white font-sans">
      {/* Fixed Header */}
      <div className="flex items-center justify-center px-6 py-4 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img
            src="../unite.svg"
            alt="logo"
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {" "}
        {/* Adjusted height to account for header */}
        {/* Sidebar */}
        <div className="hidden md:block">
          <LeftSidebar />
        </div>
        {/* Main Content */}
        <div className="w-full max-w-md mx-auto px-4 pt-6 overflow-hidden">
          {/* Search Input */}
          <div className="relative mb-6 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              className="bg-zinc-800/80 text-zinc-200 w-full py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-zinc-700/50 focus:border-blue-500/50"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Recent Searches - only show when no search query */}
          {!searchQuery && (
            <div className="mb-6">
              <h3 className="text-xs uppercase text-zinc-500 font-medium mb-3 px-1">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-zinc-800 rounded-full text-sm hover:bg-zinc-700 transition-colors">
                  @johndoe
                </button>
                <button className="px-3 py-1 bg-zinc-800 rounded-full text-sm hover:bg-zinc-700 transition-colors">
                  @sarahparker
                </button>
                <button className="px-3 py-1 bg-zinc-800 rounded-full text-sm hover:bg-zinc-700 transition-colors">
                  @techguy
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
            {searchQuery && (
              <h3 className="text-xs uppercase text-zinc-500 font-medium mb-3 px-1">
                {filteredUsers?.length}{" "}
                {filteredUsers?.length === 1 ? "Result" : "Results"}
              </h3>
            )}

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-400 bg-red-900/20 rounded-lg">
                {error}
              </div>
            ) : searchQuery && filteredUsers?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                <Users className="h-10 w-10 mb-2" />
                <p>No users found matching "{searchQuery}"</p>
              </div>
            ) : searchQuery ? (
              filteredUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/80 transition-all cursor-pointer border border-transparent hover:border-zinc-700/50"
                  onClick={() => handleUserClick(user._id)}
                >
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0 border border-zinc-700">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.username}
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="flex items-center justify-center text-sm font-medium bg-gradient-to-br from-blue-600 to-indigo-800">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.username}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>{user.followers?.length || 0} followers</span>
                      {user.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-zinc-500 hover:text-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-zinc-500 text-center">
                Start typing to search for users
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
