import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center mx-3 md:pl-[20%]">
      <Posts />
    </div>
  );
};

export default Feed;
