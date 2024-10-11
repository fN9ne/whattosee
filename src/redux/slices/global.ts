import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface globalState {
	isHeaderVisible: boolean;
	pickedPartner: number | null;
}

const initialState: globalState = {
	isHeaderVisible: false,
	pickedPartner: null,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setHeaderVisibility(state, action: PayloadAction<boolean>) {
			state.isHeaderVisible = action.payload;
		},
		setPickedPartner(state, action: PayloadAction<globalState["pickedPartner"]>) {
			state.pickedPartner = action.payload;
		},
	},
});

export default globalSlice;
