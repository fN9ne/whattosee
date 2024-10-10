import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface globalState {
	isHeaderVisible: boolean;
}

const initialState: globalState = {
	isHeaderVisible: false,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setHeaderVisibility(state, action: PayloadAction<boolean>) {
			state.isHeaderVisible = action.payload;
		},
	},
});

export default globalSlice;
