import dataSlice from "./slices/data";
import globalSlice from "./slices/global";
import storageSlice from "./slices/storage";
import userSlice from "./slices/user";

export default {
	...dataSlice.actions,
	...userSlice.actions,
	...storageSlice.actions,
	...globalSlice.actions,
};
