import { combineReducers, configureStore } from "@reduxjs/toolkit";

import modalSlice from "./slices/modal";
import { api } from "@/services/api";
import dataSlice from "./slices/data";
import userSlice from "./slices/user";
import storageSlice from "./slices/storage";
import globalSlice from "./slices/global";
import alertSlice from "./slices/alert";

const rootReducer = combineReducers({
	modal: modalSlice.reducer,
	data: dataSlice.reducer,
	user: userSlice.reducer,
	storage: storageSlice.reducer,
	global: globalSlice.reducer,
	alert: alertSlice.reducer,
	[api.reducerPath]: api.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
