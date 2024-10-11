import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC, useEffect } from "react";

const Lobby: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Что дальше?">
			<PickedPartner userId={pickedPartner} />
		</Dialog>
	);
};

export default Lobby;
