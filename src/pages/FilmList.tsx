import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";

const FilmList: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Ваш список фильмов">
			<PickedPartner userId={pickedPartner} />
		</Dialog>
	);
};

export default FilmList;
