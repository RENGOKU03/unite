import { createSlice } from "@reduxjs/toolkit";
import { all } from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    allUsers: [],
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUserBookmarks: (state, action) => {
      if (state.user) {
        // If the post is already bookmarked, remove it; otherwise, add it
        const isBookmarked = state.user.bookmarks?.includes(action.payload);

        state.user = {
          ...state.user,
          bookmarks: isBookmarked
            ? state.user.bookmarks.filter((id) => id !== action.payload)
            : [...(state.user.bookmarks || []), action.payload],
        };

        // Also update userProfile if it matches the current user
        if (state.userProfile && state.userProfile._id === state.user._id) {
          state.userProfile = {
            ...state.userProfile,
            bookmarks: state.user.bookmarks,
          };
        }
      }
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
  },
});
export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  updateUserBookmarks,
  setAllUsers,
} = authSlice.actions;
export default authSlice.reducer;
