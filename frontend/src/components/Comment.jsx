import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment = ({ comment }) => {
  // Function to format initials from username
  const getInitials = (username) => {
    if (!username) return "CN";
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="py-3 group">
      <div className="flex gap-3 items-start">
        <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-offset-black ring-gray-700">
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
            {getInitials(comment?.author?.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm">{comment?.author.username}</h1>
            {comment?.createdAt && (
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-sm mt-1 text-gray-200">{comment?.text}</p>
          <div className="flex gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
            <button className="hover:text-white transition-colors">Like</button>
            <button className="hover:text-white transition-colors">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
