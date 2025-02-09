import { setHomePosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetHomePosts = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((store) => store.auth);

  const fetchHomePosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/post/all", {
        withCredentials: true,
      });

      if (res.data.success) {
        const posts = res.data.posts;
        console.log(res.data.posts);

        // Filter posts based on the users the current user is following
        const filteredPosts =
          userProfile?.following?.length > 0
            ? posts.filter((post) =>
                userProfile.following.includes(post.author._id)
              )
            : null;
        console.log(filteredPosts);

        dispatch(setHomePosts(filteredPosts)); // Update Redux store with filtered posts
      }
    } catch (error) {
      console.error("Failed to fetch home posts:", error);
      // Optionally, you can dispatch an error action here
    }
  };

  // Fetch posts when the component mounts or when the userProfile changes
  useEffect(() => {
    fetchHomePosts();
  }, [userProfile, dispatch]);

  // Return the fetch function so it can be called manually if needed
  return { fetchHomePosts };
};

export default useGetHomePosts;
