import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";

import DiceIcon from "@icons/dice.svg?react";
import AddIcon from "@icons/add.svg?react";
import { AppRoutes } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Lobby: FC = () => {
	useDocumentTitle("Лобби");

	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Что дальше?">
			<Flex gap={20} column>
				<PickedPartner userId={pickedPartner} />
				<Flex column gap={8}>
					<Button to={AppRoutes.FilmList} icon={DiceIcon}>
						Выбрать фильм
					</Button>
					<Button to={AppRoutes.AddFilm} style="secondary" icon={AddIcon}>
						Добавить фильм
					</Button>
				</Flex>
			</Flex>
		</Dialog>
	);
};

export default Lobby;
