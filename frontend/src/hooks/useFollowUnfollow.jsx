import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const useFollowUnfollow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const handleFollowToggle = async (userid) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userid}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/user/${user._id}/profile`,
            { withCredentials: true }
          );
          if (res.data.success) {
            dispatch(setUserProfile(res.data.user));
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
