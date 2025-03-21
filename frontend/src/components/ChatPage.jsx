import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode, Send, Search, Menu, X } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  // Filter users based on search query
  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `https://unite-dd7d.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && selectedUser) {
      e.preventDefault();
      sendMessageHandler(selectedUser?._id);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex flex-col ml-64 md:flex-row h-[calc(100vh-4rem)] bg-gray-950 text-gray-200">
      {/* Mobile toggle button */}
      <div className="md:hidden flex items-center justify-between p-3 bg-gray-900">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback className="bg-gray-800">
              {user?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user?.username}</span>
        </div>
        <Button variant="ghost" className="p-1" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <section
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-1/4 lg:w-1/5 md:min-w-64 border-r border-gray-800 bg-gray-900 overflow-hidden flex flex-col`}
      >
        <div className="p-4 hidden md:block">
          <h1 className="font-bold text-xl text-gray-100">{user?.username}</h1>
          <p className="text-sm text-gray-400">Your conversations</p>
        </div>

        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search contacts..."
              className="pl-8 bg-gray-800 border-gray-700 text-gray-200 focus-visible:ring-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              const isSelected = selectedUser?._id === suggestedUser?._id;

              return (
                <div
                  onClick={() => {
                    dispatch(setSelectedUser(suggestedUser));
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className={`flex gap-3 items-center p-3 mx-2 my-1 rounded-lg
                   cursor-pointer transition-colors ${
                     isSelected ? "bg-gray-800" : "hover:bg-gray-800/50"
                   }`}
                  key={suggestedUser?._id}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 border border-gray-700">
                      <AvatarImage src={suggestedUser?.profilePicture} />
                      <AvatarFallback className="bg-gray-700">
                        {suggestedUser?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></span>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium truncate">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-xs ${
                        isOnline ? "text-green-400" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
              <Search className="h-12 w-12 mb-2 opacity-50" />
              <p>No contacts found</p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-indigo-400"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Chat area */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full bg-gray-950">
          <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 p-1"
                onClick={toggleMobileMenu}
              >
                <Menu size={20} />
              </Button>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback className="bg-gray-700">
                {selectedUser?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{selectedUser?.username}</span>
              <span className="text-xs text-gray-400">
                {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className="flex items-center p-4 border-t border-gray-800 bg-gray-900">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              type="text"
              className="flex-1 mr-2 bg-gray-800 border-gray-700 text-gray-200 focus-visible:ring-gray-700"
              placeholder="Type a message..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!textMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto flex-1 p-6 text-center">
          <div className="bg-gray-900 p-8 rounded-2xl flex flex-col items-center max-w-md">
            <MessageCircleCode className="w-24 h-24 mb-6 text-indigo-500" />
            <h1 className="font-medium text-xl mb-2">Your messages</h1>
            <p className="text-gray-400 mb-4">
              Select a contact to start a conversation.
            </p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={toggleMobileMenu}
            >
              View Contacts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
