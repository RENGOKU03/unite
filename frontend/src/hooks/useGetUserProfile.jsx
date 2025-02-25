import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { use } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        console.log(res.data.user);

        if (res.data.success) {
          console.log(res.data.user);

          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    return fetchUserProfile;
  }, [userId, dispatch]);
};
export default useGetUserProfile;
