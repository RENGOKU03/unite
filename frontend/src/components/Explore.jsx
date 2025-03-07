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
          <Play className="w-10 h-10 md:w-12 md:h-12 text-white opacity-80" />
        </div>
      );
    }
    return null;
  };

  const renderHoverContent = (post) => {
    return (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-4 md:space-x-6 backdrop-blur-sm transition-all duration-200">
        <div className="flex items-center space-x-1 md:space-x-2">
          <span className="text-white text-sm md:text-base font-semibold">
            {post.likes?.length || 0}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <span className="text-white text-sm md:text-base font-semibold">
            {post.comments?.length || 0}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        </div>
        {post.video && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted(!muted);
            }}
            className="p-1.5 md:p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            {muted ? (
              <VolumeX className="h-5 w-5 md:h-6 md:w-6 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
            )}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ml-0 md:ml-[20%] h-screen flex items-center justify-center bg-zinc-900">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-0 md:ml-[20%] h-screen flex items-center justify-center bg-zinc-900">
        <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 max-w-xs md:max-w-md mx-4">
          <p className="text-red-400 font-medium text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 md:ml-[20%] px-2 sm:px-4 py-6 md:py-8 min-h-screen overflow-y-auto bg-zinc-900 text-zinc-100">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2 lg:gap-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative aspect-square group cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredPost(post._id)}
            onMouseLeave={() => setHoveredPost(null)}
            onClick={() => console.log(`Clicked post: ${post._id}`)}
          >
            <img
              src={post.image}
              alt={`Post by ${post.author?.username || "Unknown"}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {renderMediaOverlay(post)}
            {hoveredPost === post._id && renderHoverContent(post)}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs sm:text-sm truncate">
                {post.author?.username || "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
          <p className="text-center mb-4">No posts to display</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
