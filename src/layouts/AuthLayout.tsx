import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { AppRoutes } from "@/types";
import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout: FC = () => {
	const { user } = useAppSelector((state) => state.user);
	const navigate = useNavigate();
	const { setHeaderVisibility } = useActions();

	useEffect(() => {
		if (user !== null && user !== undefined) {
			navigate(AppRoutes.Home);
		}
	}, [user]);

	useEffect(() => {
		setHeaderVisibility(false);
	}, []);

	return <Outlet />;
};

export default AuthLayout;
