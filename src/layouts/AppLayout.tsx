import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { AppRoutes } from "@/types";
import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AppLayout: FC = () => {
	const { user } = useAppSelector((state) => state.user);
	const { setHeaderVisibility } = useActions();

	const navigate = useNavigate();

	useEffect(() => {
		if (user === null) {
			navigate(AppRoutes.GettingStarted);
		}
	}, [user]);

	useEffect(() => {
		setHeaderVisibility(true);
	}, []);

	return <Outlet />;
};

export default AppLayout;
