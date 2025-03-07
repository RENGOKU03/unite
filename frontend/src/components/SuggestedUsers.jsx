import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import useGetHomePosts from "@/hooks/useGetHomePosts";
import { useState } from "react";

const SuggestedUsers = ({ user }) => {
  const { suggestedUsers, userProfile } = useSelector((store) => store.auth);
  const followUnfollow = useFollowUnfollow();
  const [loadingStates, setLoadingStates] = useState({});

  const handleFollowToggle = async (userId) => {
    try {
      // Set loading state for this specific user
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));
      await followUnfollow(userId);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // If no suggested users, don't render anything
  if (!suggestedUsers || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 my-6 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-gray-200">
          Suggested for you
        </h2>
      </div>
      <div className="p-4">
        {suggestedUsers.map((user) => {
          const isFollowing = userProfile?.following?.includes(user._id);
          const isLoading = loadingStates[user._id];

          return (
            <div
              key={user._id}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors duration-200 px-2 rounded-md"
            >
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user?._id}`} className="relative group">
                  <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-800 group-hover:ring-blue-900 transition-all duration-200">
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={`${user?.username}'s profile picture`}
                    />
                    <AvatarFallback className="bg-gray-700 text-blue-400">
                      {user?.username?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-sm text-gray-100 truncate">
                    <Link
                      to={`/profile/${user?._id}`}
                      className="hover:text-blue-400 transition-colors duration-200"
                    >
                      {user?.username}
                    </Link>
                  </h3>
                  <p className="text-gray-400 text-xs truncate max-w-xs">
                    {user?.bio || "No bio available"}
                  </p>
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                  isLoading
                    ? "bg-gray-700 cursor-not-allowed"
                    : isFollowing
                    ? "text-gray-300 hover:text-red-400 border border-gray-700 hover:border-red-800 bg-gray-800"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
                onClick={() => !isLoading && handleFollowToggle(user._id)}
                disabled={isLoading}
                aria-label={isFollowing ? "Unfollow user" : "Follow user"}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : isFollowing ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="hidden sm:inline">Following</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <span className="hidden sm:inline">Follow</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
