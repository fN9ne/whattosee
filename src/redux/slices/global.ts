import { IFilm } from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface globalState {
	isHeaderVisible: boolean;
	pickedPartner: number | null;
	result: IFilm | null;
}

const initialState: globalState = {
	isHeaderVisible: false,
	pickedPartner: null,
	result: null,
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
		setResult(state, action: PayloadAction<IFilm | null>) {
			state.result = action.payload;
		},
	},
});

export default globalSlice;
