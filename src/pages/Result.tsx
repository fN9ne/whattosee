import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";

const Result: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Приятного просмотра!">
			<PickedPartner userId={pickedPartner} />
		</Dialog>
	);
};

export default Result;
