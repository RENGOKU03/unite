import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { UserIcon } from "lucide-react";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const groupedMessages = {};
  messages?.forEach((msg) => {
    const date = getMessageDate(msg.createdAt || Date.now());
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(msg);
  });

  return (
    <div className="overflow-y-auto flex-1 p-4 bg-gray-950 text-gray-200 flex flex-col">
      <div className="flex justify-center mb-6 bg-gray-900/50 rounded-2xl p-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20 border-2 border-gray-800 mb-3">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback className="bg-gray-800 text-indigo-400">
              {selectedUser?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-100 mb-1">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button
              className="h-8 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              size="sm"
            >
              <UserIcon className="h-4 w-4 mr-1" />
              View profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {Object.keys(groupedMessages).length > 0 ? (
          Object.keys(groupedMessages).map((date) => (
            <div key={date} className="message-group">
              <div className="flex items-center justify-center my-3">
                <div className="h-px bg-gray-800 flex-1" />
                <span className="px-3 text-xs text-gray-500">{date}</span>
                <div className="h-px bg-gray-800 flex-1" />
              </div>

              {groupedMessages[date].map((msg) => {
                const isMyMessage = msg.senderId === user?._id;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      isMyMessage ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    {!isMyMessage && (
                      <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                        <AvatarImage src={selectedUser?.profilePicture} />
                        <AvatarFallback className="bg-gray-800 text-xs">
                          {selectedUser?.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`p-3 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md break-words ${
                        isMyMessage
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-gray-800 text-gray-100 rounded-tl-none"
                      }`}
                    >
                      {msg.message}
                      <div
                        className={`text-xs mt-1 opacity-70 flex justify-end`}
                      >
                        {new Date(
                          msg.createdAt || Date.now()
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-2">
              Start the conversation by sending a message
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
