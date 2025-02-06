import { Menu, Search } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import useGetAllUsers from "@/hooks/useGetAllUsers";
import { useSelector } from "react-redux";
import { useState } from "react";

const SearchBox = () => {
  useGetAllUsers();
  const { allUsers } = useSelector((store) => store.auth);
  const { isLoading, error } = useGetAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = allUsers?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="z-40 h-screen w-screen bg-black text-white">
      <div className="flex justify-center items-center align-middle">
        <Menu size={40} className="absolute top-4 left-6 z-20 md:hidden" />
        <img src="../unite.svg" alt="logo" className=" mx-auto mt-4" />
      </div>
      <LeftSidebar />
      <div className=" w-[400px] m-auto mt-10 ">
        <div className="flex justify-center gap-3 py-3 items-center w-[20rem] ">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 outline-none rounded-xl bg-gray-500 w-72"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={30}
            color="white"
            className="cursor-pointer hover:bg-gray-900 rounded-full hover:scale-110 transition-all"
          />
        </div>
        <div className="mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            filteredUsers?.map((user) => (
              <div
                key={user._id}
                className="flex justify-start items-center gap-5 cursor-pointer bg-gray-950 px-3 py-2 rounded-xl w-[20rem] mt-2 hover:bg-gray-900 transition-all h-[70px]"
              >
                <Avatar>
                  <AvatarImage
                    src={user.profilePicture}
                    alt={user.username}
                    className="rounded-full aspect-square h-16"
                  />
                  <AvatarFallback className="text-3xl px-4">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{user.username}</p>
                  <span className="text-sm text-gray-400">
                    {user.followers?.length || 0} followers
                  </span>
                </div>
              </div>
            ))
          )}
          {filteredUsers?.length === 0 && (
            <div className="text-center py-4 text-gray-400">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
