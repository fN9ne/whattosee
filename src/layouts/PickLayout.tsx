import { useAppSelector } from "@/hooks/useAppSelector";
import { AppRoutes } from "@/types";
import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PickLayout: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);
	const navigate = useNavigate();

	useEffect(() => {
		if (!pickedPartner) {
			navigate(AppRoutes.Home);
		}
	}, [pickedPartner]);

	return <Outlet />;
};

export default PickLayout;
