import { setAllUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllUsers = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    var isMounted = true;

    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.get(
          "https://unite-dd7d.onrender.com/api/v1/user/all",
          {
            withCredentials: true,
          }
        );

        if (isMounted && res.data.success) {
          dispatch(setAllUsers(res.data.users));
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch users";
          console.error("Error fetching users:", error);
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllUsers();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [dispatch]); // Added dispatch to dependencies

  return { isLoading, error };
};

export default useGetAllUsers;
