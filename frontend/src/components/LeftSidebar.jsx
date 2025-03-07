import {
  Heart,
  HomeIcon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);

  // Set the active tab based on the current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveTab("Home");
    else if (path === "/search") setActiveTab("Search");
    else if (path === "/explore") setActiveTab("Explore");
    else if (path === "/chat") setActiveTab("Messages");
    else if (path.includes("/profile")) setActiveTab("Profile");
  }, [location.pathname]);

  const logoutHandler = async () => {
    console.log("Logout clicked");

    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  const handleSidebarClick = (textType) => {
    setActiveTab(textType);

    switch (textType) {
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      case "Search":
        navigate("/search");
        break;
      case "Explore":
        navigate("/explore");
        break;
      case "Logout":
        logoutHandler();
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <HomeIcon size={20} />, text: "Home" },
    { icon: <Search size={20} />, text: "Search" },
    { icon: <TrendingUp size={20} />, text: "Explore" },
    { icon: <MessageCircle size={20} />, text: "Messages" },
    { icon: <Bell size={20} />, text: "Notifications" },
    { icon: <PlusSquare size={20} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 border border-zinc-700">
          <AvatarImage src={user?.profilePicture} alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs">
            {user?.username?.slice(0, 2)?.toUpperCase() || "UN"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
  ];

  const NotificationPopover = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="absolute -top-1 -right-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {likeNotification.length}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl">
          <div className="p-4">
            <h3 className="font-medium text-zinc-200 mb-2">Notifications</h3>
            {likeNotification.length === 0 ? (
              <p className="text-zinc-400 text-sm">No new notifications</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {likeNotification.map((notification) => (
                  <div
                    key={notification.userId}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <Avatar className="h-9 w-9 border border-zinc-700">
                      <AvatarImage
                        src={notification.userDetails?.profilePicture}
                        alt="User"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs">
                        {notification.userDetails?.username
                          ?.slice(0, 2)
                          ?.toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-zinc-200">
                        <span className="font-medium">
                          {notification.userDetails?.username}
                        </span>{" "}
                        liked your post
                      </p>
                      <p className="text-xs text-zinc-500">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div
      className={`fixed top-0 z-10 left-0 h-screen bg-zinc-900 border-r border-zinc-800/50 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } overflow-hidden`}
    >
      <div className="flex items-center justify-center p-4 border-b border-zinc-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={20} className="text-zinc-400" />
          ) : (
            <ChevronLeft size={20} className="text-zinc-400" />
          )}
        </button>
      </div>

      <div className="flex flex-col p-3 h-[calc(100vh-140px)] overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSidebarClick(item.text)}
            className={`flex items-center gap-3 relative rounded-xl p-3 my-1 cursor-pointer transition-all duration-200 group ${
              activeTab === item.text
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "hover:bg-zinc-800/70 text-zinc-400 hover:text-zinc-200"
            }`}
            role="button"
            aria-label={item.text}
          >
            <div className="relative">
              {item.icon}
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <NotificationPopover />
              )}
            </div>

            {!collapsed && (
              <span className="text-sm font-medium">{item.text}</span>
            )}

            {collapsed && (
              <div className="absolute left-16 opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 rounded-md px-2 py-1 text-xs z-50 pointer-events-none transition-opacity">
                {item.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-zinc-800/50">
        <div
          onClick={() => handleSidebarClick("Logout")}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}

          {collapsed && (
            <div className="absolute left-16 opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 rounded-md px-2 py-1 text-xs z-50 pointer-events-none transition-opacity">
              Logout
            </div>
          )}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
