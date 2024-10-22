import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";
import Button from "@/components/UI/Button";

import DiceIcon from "@icons/dice.svg?react";
import AddIcon from "@icons/add.svg?react";
import Flex from "@/components/Flex";
import { AppRoutes } from "@/types";

const Lobby: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Что дальше?">
			<PickedPartner userId={pickedPartner} />
			<Flex column gap={8}>
				<Button to={AppRoutes.FilmList} icon={DiceIcon}>
					Выбрать фильм
				</Button>
				<Button to={AppRoutes.AddFilm} style="secondary" icon={AddIcon}>
					Добавить фильм
				</Button>
			</Flex>
		</Dialog>
	);
};

export default Lobby;
