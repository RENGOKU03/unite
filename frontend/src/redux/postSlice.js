import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    leftSideBar: false,
    homePosts: [],
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    toggleLeftSideBar: (state) => {
      state.leftSideBar = !state.leftSideBar;
    },
    setHomePosts: (state, action) => {
      state.homePosts = action.payload;
    },
  },
});
export const { setPosts, setSelectedPost, toggleLeftSideBar, setHomePosts } =
  postSlice.actions;
export default postSlice.reducer;
