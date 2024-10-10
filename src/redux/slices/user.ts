import { IUser } from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
	user: IUser | null | undefined;
}

const initialState: userState = {
	user: undefined,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<userState["user"]>) {
			state.user = action.payload;
		},
	},
});

export default userSlice;
