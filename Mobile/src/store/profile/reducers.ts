import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileState } from "./types";
import { IUser } from "../auth/types";

const initialState: ProfileState = {
    me: {} as IUser,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        fetchGetMe(state) {
            state.loading = true;
            state.error = null;
        },
        getMeSuccess(state, action: PayloadAction<IUser>) {
            state.loading = false;
            state.me = action.payload;
            state.error = null;
        },
        getMeFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateProfileSuccess: (state, action: PayloadAction<IUser>) => {
            state.loading = false;
            state.error = null;
            state.me = action.payload;
        },
        updateProfileFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchGetMe, getMeSuccess, getMeFailed, updateProfileRequest, updateProfileSuccess, updateProfileFailure } = profileSlice.actions;
export default profileSlice.reducer;