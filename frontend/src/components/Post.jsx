import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  MoreHorizontal,
  Send,
  Heart,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { DialogTitle } from "@radix-ui/react-dialog";
import { updateUserBookmarks } from "@/redux/authSlice";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user, userProfile } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const followUnfollow = useFollowUnfollow();

  const handleFollowToggle = async (userId) => {
    try {
      await followUnfollow(userId);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  // Format the post date
  const formatPostDate = () => {
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return postDate.toLocaleDateString();
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      setIsLoading(true);
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://unite-dd7d.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      const res = await axios.post(
        `https://unite-dd7d.onrender.com/api/v1/post/${post._id}/comment`,
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
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
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

  const deletePostHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `https://unite-dd7d.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setIsLoading(false);
    }
  };

  const bookmarkHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://unite-dd7d.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateUserBookmarks(post._id));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 w-full max-w-[650px] mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?._id}`} className="relative group">
            <Avatar className="h-10 w-10 ring-2 ring-offset-1 ring-gray-800 group-hover:ring-blue-900 transition-all duration-200">
              <AvatarImage
                src={post.author?.profilePicture}
                alt={`${post.author?.username}'s profile picture`}
              />
              <AvatarFallback className="bg-gray-700 text-blue-400">
                {post.author?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${post.author?._id}`}
                className="font-semibold text-gray-100 hover:text-blue-400 transition-colors duration-200"
              >
                {post.author?.username}
              </Link>
              {user?._id === post.author._id && (
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5"
                >
                  You
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatPostDate()}</span>
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-800"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 p-0 overflow-hidden rounded-xl">
            <div className="flex flex-col w-full divide-y divide-gray-800">
              {post?.author?._id !== user?._id && (
                <Button
                  variant="ghost"
                  onClick={() => handleFollowToggle(post?.author?._id)}
                  className="py-3 rounded-none text-base font-medium hover:bg-red-500 text-gray-100 hover:text-white"
                >
                  {userProfile?.following.includes(post?.author?._id)
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              )}
              <Button
                variant="ghost"
                className="py-3 rounded-none text-base font-medium hover:bg-gray-800 text-gray-100"
                onClick={bookmarkHandler}
              >
                {user?.bookmarks?.includes(post._id)
                  ? "Remove from bookmarks"
                  : "Add to bookmarks"}
              </Button>
              {user && user?._id === post?.author._id && (
                <Button
                  onClick={deletePostHandler}
                  variant="ghost"
                  className="py-3 rounded-none text-base font-medium hover:bg-gray-800 text-red-500"
                  disabled={isLoading}
                >
                  Delete post
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Media */}
      <div className="bg-gray-950 flex items-center justify-center">
        {post.image === null ? (
          <video
            className="w-full object-contain max-h-[600px]"
            src={post.video}
            controls
          />
        ) : (
          <img
            className="w-full object-contain max-h-[600px]"
            src={post.image}
            alt={post.caption || "Post image"}
            loading="lazy"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              className="group flex items-center justify-center focus:outline-none"
              onClick={likeOrDislikeHandler}
              disabled={isLoading}
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
            <button
              className="group flex items-center justify-center focus:outline-none"
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              aria-label="View comments"
            >
              <MessageCircle className="h-6 w-6 text-gray-400 group-hover:text-gray-200 group-hover:scale-110 transition-all duration-200" />
            </button>
          </div>
          <button
            className="group flex items-center justify-center focus:outline-none"
            onClick={bookmarkHandler}
            disabled={isLoading}
            aria-label={
              user?.bookmarks?.includes(post._id)
                ? "Remove bookmark"
                : "Add bookmark"
            }
          >
            {user?.bookmarks?.includes(post._id) ? (
              <BookmarkCheck className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <Bookmark className="h-6 w-6 text-gray-400 group-hover:text-gray-200 group-hover:scale-110 transition-all duration-200" />
            )}
          </button>
        </div>

        {/* Post Stats */}
        <div className="mb-2">
          <span className="font-semibold text-gray-100">{postLike} likes</span>
        </div>

        {/* Post Caption */}
        <div className="mb-2 text-gray-300">
          <span className="font-semibold text-gray-100 mr-2">
            {post.author?.username}
          </span>
          {post.caption}
        </div>

        {/* Comments Link */}
        {comment.length > 0 && (
          <button
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors duration-200 mb-3"
          >
            View all {comment.length} comments
          </button>
        )}
        <CommentDialog open={open} setOpen={setOpen} />
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-gray-800 flex items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="bg-gray-800 border-none text-gray-200 rounded-full py-2 px-4 flex-grow text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {text && (
          <button
            onClick={commentHandler}
            disabled={isLoading}
            className="ml-2 text-blue-400 hover:text-blue-300 font-semibold focus:outline-none transition-colors duration-200"
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
