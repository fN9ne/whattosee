import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface alertState {
	type: "success" | "error" | "common";
	message: string | string[];
	visible: boolean;
}

const initialState: alertState = {
	type: "common",
	message: "",
	visible: false,
};

const alertSlice = createSlice({
	name: "alert",
	initialState,
	reducers: {
		setAlertType(state, action: PayloadAction<alertState["type"]>) {
			state.type = action.payload;
		},
		setAlertMessage(state, action: PayloadAction<string | string[]>) {
			state.message = action.payload;
		},
		setAlertVisibility(state, action: PayloadAction<boolean>) {
			state.visible = action.payload;
		},
	},
});

export default alertSlice;
