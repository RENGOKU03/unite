import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Bookmark,
  BookmarkCheck,
  X,
  SmilePlus,
} from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { updateUserBookmarks } from "@/redux/authSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [postLike, setPostLike] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  // Function to format initials from username
  const getInitials = (username) => {
    if (!username) return "CN";
    return username.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments || []);
      // Check if user has already liked the post
      setLiked(selectedPost?.likes?.includes(user?._id) || false);
      setPostLike(selectedPost?.likes?.length || 0);
    }
  }, [selectedPost, user]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      setIsLoading(true);
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        // Update the selected post too
        dispatch(
          setSelectedPost({
            ...selectedPost,
            likes: liked
              ? selectedPost.likes.filter((id) => id !== user._id)
              : [...selectedPost.likes, user._id],
          })
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const bookmarkHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateUserBookmarks(selectedPost._id));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  // Simple date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  // Time elapsed formatter
  const getTimeElapsed = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - postDate;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffWeeks > 0) return `${diffWeeks}w`;
    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}m`;
    return "just now";
  };

  // Custom scrollbar styles
  const scrollbarClasses =
    "overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-900/30";

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black h-[85vh] max-h-[85vh]"
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 p-1 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-1 h-full">
          <div className="w-3/5 bg-black flex items-center justify-center relative">
            {/* Left/Right navigation arrows could be added here */}
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-2/5 flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white border-l border-gray-800">
            {/* Header - Fixed height */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500/50">
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 text-xs">
                      {getInitials(selectedPost?.author?.username)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link
                    to={`/profile/${selectedPost?.author?._id}`}
                    className="font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    {selectedPost?.author?.username}
                    {selectedPost?.author?.verified && (
                      <span className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {selectedPost?.location || ""}
                  </span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-2 hover:bg-gray-800/50 rounded-full transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center p-0 bg-gray-900/95 backdrop-blur-md text-white border border-gray-800 rounded-xl">
                  <button className="cursor-pointer w-full p-4 text-[#ED4956] font-bold hover:bg-gray-800/70 transition-colors">
                    Unfollow
                  </button>
                  <hr className="border-gray-800/50 w-full" />
                  <button
                    className="cursor-pointer w-full p-4 hover:bg-gray-800/70 transition-colors"
                    onClick={bookmarkHandler}
                    disabled={isLoading}
                  >
                    {user?.bookmarks?.includes(selectedPost?._id)
                      ? "Remove from bookmarks"
                      : "Add to bookmarks"}
                  </button>
                  <hr className="border-gray-800/50 w-full" />
                  <button className="cursor-pointer w-full p-4 hover:bg-gray-800/70 transition-colors">
                    Report
                  </button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Tabs - Fixed height */}
            <div className="border-b border-gray-800/50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`flex-1 py-2.5 text-sm font-medium relative ${
                    activeTab === "comments" ? "text-white" : "text-gray-500"
                  }`}
                >
                  Comments
                  {activeTab === "comments" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("likes")}
                  className={`flex-1 py-2.5 text-sm font-medium relative ${
                    activeTab === "likes" ? "text-white" : "text-gray-500"
                  }`}
                >
                  Likes{" "}
                  {selectedPost?.likes?.length > 0 &&
                    `(${selectedPost.likes.length})`}
                  {activeTab === "likes" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Content area - This is the flexible part that will shrink or grow */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {activeTab === "comments" ? (
                <>
                  {/* Caption - This should have a static height */}
                  {selectedPost?.caption && (
                    <div className="p-4 border-b border-gray-800/40">
                      <div className="flex gap-3 items-start">
                        <Avatar className="h-8 w-8 ring-2 ring-offset-1 ring-offset-gray-900 ring-gray-700">
                          <AvatarImage
                            src={selectedPost?.author?.profilePicture}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 text-xs">
                            {getInitials(selectedPost?.author?.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h1 className="font-bold text-sm">
                              {selectedPost?.author.username}
                            </h1>
                            <span className="text-xs text-gray-400">
                              {getTimeElapsed(selectedPost?.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm mt-1 text-gray-200">
                            {selectedPost?.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments - This should take the remaining space and scroll */}
                  <div
                    className={`flex-1 px-4 py-2 space-y-1 ${scrollbarClasses}`}
                  >
                    {comment.length > 0 ? (
                      comment.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageCircle className="h-12 w-12 mb-2 opacity-40" />
                        <p>No comments yet</p>
                        <p className="text-sm">Be the first to comment!</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className={`flex-1 p-4 space-y-2 ${scrollbarClasses}`}>
                  <h3 className="font-medium text-sm mb-4">Liked by</h3>
                  {selectedPost?.likes?.length > 0 ? (
                    Array(Math.min(selectedPost.likes.length, 5))
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900">
                                US
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                User {index + 1}
                              </p>
                              <p className="text-xs text-gray-400">
                                @username{index + 1}
                              </p>
                            </div>
                          </div>
                          <button className="text-xs font-medium py-1.5 px-3 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors">
                            Follow
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                      <Heart className="h-12 w-12 mb-2 opacity-40" />
                      <p>No likes yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions - Fixed height */}
            <div className="p-3 border-t border-gray-800/50 bg-gradient-to-r from-gray-900 to-black">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button
                    onClick={likeOrDislikeHandler}
                    disabled={isLoading}
                    className="group flex items-center justify-center focus:outline-none"
                    aria-label={liked ? "Unlike post" : "Like post"}
                  >
                    {liked ? (
                      <FaHeart
                        size={24}
                        className="text-red-500 group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <FaRegHeart
                        size={24}
                        className="text-gray-400 group-hover:text-gray-200 group-hover:scale-110 transition-all duration-200"
                      />
                    )}
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
                <button
                  onClick={bookmarkHandler}
                  disabled={isLoading}
                  className="group flex items-center justify-center focus:outline-none"
                  aria-label={
                    user?.bookmarks?.includes(selectedPost?._id)
                      ? "Remove bookmark"
                      : "Add bookmark"
                  }
                >
                  {user?.bookmarks?.includes(selectedPost?._id) ? (
                    <BookmarkCheck className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <Bookmark className="h-6 w-6 text-gray-400 group-hover:text-gray-200 group-hover:scale-110 transition-all duration-200" />
                  )}
                </button>
              </div>
              <div className="mt-2 px-2">
                <p className="text-sm font-bold">{postLike} likes</p>
                {selectedPost?.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(selectedPost.createdAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Comment input - Fixed height */}
            <div className="p-3 border-t border-gray-800/50 bg-gradient-to-r from-gray-900 to-black">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors text-gray-400">
                  <SmilePlus className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border-none text-sm p-2.5 rounded-full bg-gray-800/50 backdrop-blur-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-700 transition-colors"
                />
                <button
                  disabled={!text.trim() || isLoading}
                  onClick={sendMessageHandler}
                  className={`p-2 rounded-full transition-all ${
                    text.trim() && !isLoading
                      ? "text-white bg-[#ED4956] hover:bg-[#da313f] scale-100"
                      : "text-gray-500 bg-gray-800/30 scale-90"
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
