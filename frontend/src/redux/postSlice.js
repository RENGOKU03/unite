import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    leftSideBar: false,
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
  },
});
export const { setPosts, setSelectedPost, toggleLeftSideBar } =
  postSlice.actions;
export default postSlice.reducer;
