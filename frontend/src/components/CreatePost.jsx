import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      if (file.type.startsWith("image/")) {
        const dataUrl = await readFileAsDataURL(file);
        setImagePreview(dataUrl);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        setImagePreview(videoUrl);
      }
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "https://unite-dd7d.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setCaption("");
      setImagePreview("");
      setFile("");
    }
  };

  const removeImagePreview = () => {
    setImagePreview("");
    setFile("");
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="bg-gray-900 text-gray-100 border-gray-800 sm:max-w-md max-w-[90vw]"
      >
        <DialogHeader className="text-center font-semibold border-b border-gray-800 pb-3">
          <div className="flex justify-between items-center">
            <div className="w-8" />
            <h3 className="text-lg">Create New Post</h3>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar className="border border-gray-700">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback className="bg-gray-800 text-gray-300">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm text-gray-100">
              {user?.username || "Username"}
            </h1>
            <span className="text-gray-400 text-xs">
              {user?.bio || "Bio here..."}
            </span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent bg-gray-800 border-gray-700 min-h-24 placeholder:text-gray-500 text-gray-100"
          placeholder="Write a caption..."
        />

        {imagePreview ? (
          <div className="relative w-full h-64 group">
            <img
              src={imagePreview}
              alt="preview"
              className="object-cover h-full w-full rounded-md bg-gray-800"
            />
            <button
              onClick={removeImagePreview}
              className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 p-1.5 rounded-full text-white opacity-80 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className="w-full h-40 border-2 border-dashed border-gray-700 rounded-md flex items-center justify-center flex-col gap-2 cursor-pointer hover:border-gray-600 transition-colors"
            onClick={() => imageRef.current.click()}
          >
            <ImageIcon size={32} className="text-gray-500" />
            <p className="text-gray-400 text-sm font-medium">
              Upload Photo or Video
            </p>
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={fileChangeHandler}
        />

        <div className="flex gap-3 w-full">
          {!imagePreview && (
            <Button
              onClick={() => imageRef.current.click()}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
              variant="outline"
            >
              Select Media
            </Button>
          )}

          <Button
            onClick={createPostHandler}
            disabled={loading || (!caption && !imagePreview)}
            className={`flex-1 ${
              !imagePreview
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-600 hover:bg-blue-500 w-full"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
