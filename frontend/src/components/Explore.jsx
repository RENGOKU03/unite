import React, { useEffect, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

const Explore = () => {
  const [hoveredPost, setHoveredPost] = useState(null);
  const [muted, setMuted] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/v1/post/all", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          setError("Failed to fetch posts");
        }
      } catch (error) {
        setError("Error connecting to server");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderMediaOverlay = (post) => {
    if (post.video) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-80" />
        </div>
      );
    }
    return null;
  };

  const renderHoverContent = (post) => {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-6 ">
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold">
            {post.likes?.length || 0}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold">
            {post.comments?.length || 0}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        </div>
        {post.video && (
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75"
          >
            {muted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ml-[20%] h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-[20%] h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="ml-[20%] mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative aspect-square group cursor-pointer"
            onMouseEnter={() => setHoveredPost(post._id)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <img
              src={post.image}
              alt={`Post by ${post.author?.username || "Unknown"}`}
              className="w-full h-full object-cover"
            />
            {renderMediaOverlay(post)}
            {hoveredPost === post._id && renderHoverContent(post)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
