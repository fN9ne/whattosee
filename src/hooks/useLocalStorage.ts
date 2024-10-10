import { useEffect } from "react";

export const useLocalStorage = (key: string, dispatch: (data: any) => void) => {
	useEffect(() => {
		const data = localStorage.getItem(key);

		if (data) dispatch(JSON.parse(data));
		else dispatch(null);
	}, []);
};
