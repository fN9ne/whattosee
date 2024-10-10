import { api, IFetchData } from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IFetchData = {
	users: [],
	items: [],
	duets: [],
};

const dataSlice = createSlice({
	name: "data",
	initialState,
	reducers: {
		setData(_, action: PayloadAction<IFetchData>) {
			return action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(api.endpoints.read.matchFulfilled, (_, { payload }) => {
			return payload;
		});
	},
});

export default dataSlice;
