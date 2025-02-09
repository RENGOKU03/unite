import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import useGetHomePosts from "@/hooks/useGetHomePosts";

const SuggestedUsers = ({ user }) => {
  const { suggestedUsers, userProfile } = useSelector((store) => store.auth);
  const followUnfollow = useFollowUnfollow();
  const handleFollowToggle = async (userId) => {
    try {
      await followUnfollow(userId);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span
              onClick={() => handleFollowToggle(user._id)}
              className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] transition-colors duration-200"
              role="button"
              aria-label={
                userProfile?.following?.includes(user._id)
                  ? "Unfollow"
                  : "Follow"
              }
            >
              {userProfile?.following?.includes(user._id)
                ? "Following"
                : "Follow"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
