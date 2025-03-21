import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useGetHomePosts from "./useGetHomePosts";

const useFollowUnfollow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const getHomePost = useGetHomePosts();

  const handleFollowToggle = async (userid) => {
    try {
      const response = await axios.post(
        `https://unite-dd7d.onrender.com/api/v1/user/followorunfollow/${userid}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        try {
          const res = await axios.get(
            `https://unite-dd7d.onrender.com/api/v1/user/${user._id}/profile`,
            { withCredentials: true }
          );
          if (res.data.success) {
            dispatch(setUserProfile(res.data.user));
            getHomePost();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error);
    }
  };
  return handleFollowToggle;
};
export default useFollowUnfollow;
