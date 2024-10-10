import dataSlice from "./slices/data";
import globalSlice from "./slices/global";
import modalSlice from "./slices/modal";
import storageSlice from "./slices/storage";
import userSlice from "./slices/user";

export default {
	...modalSlice.actions,
	...dataSlice.actions,
	...userSlice.actions,
	...storageSlice.actions,
	...globalSlice.actions,
};
