import { useCallback } from "react";
import { useActions } from "./useActions";
import { alertState } from "@/redux/slices/alert";

export const useAlert = () => {
	const { setAlertVisibility, setAlertType, setAlertMessage } = useActions();

	const triggerAlert = useCallback((message: string | string[], type: alertState["type"], hideTimeout: number = 3) => {
		setAlertMessage(message);
		setAlertType(type);
		setAlertVisibility(true);

		setTimeout(() => {
			setAlertVisibility(false);
		}, hideTimeout * 1000);
	}, []);

	return triggerAlert;
};
