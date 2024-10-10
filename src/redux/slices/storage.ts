import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface storageState {
	userId: number | null | undefined;
}

const initialState: storageState = {
	userId: undefined,
};

const storageSlice = createSlice({
	name: "storage",
	initialState,
	reducers: {
		setUserId(state, action: PayloadAction<storageState["userId"]>) {
			state.userId = action.payload;
		},
	},
});

export default storageSlice;
