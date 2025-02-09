import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { homePosts } = useSelector((store) => store.post);
  return (
    <div>
      {homePosts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
