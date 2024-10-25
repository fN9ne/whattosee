import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";
<<<<<<< HEAD

import DiceIcon from "@icons/dice.svg?react";
import AddIcon from "@icons/add.svg?react";
import { AppRoutes } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
=======
import Button from "@/components/UI/Button";

import DiceIcon from "@icons/dice.svg?react";
import AddIcon from "@icons/add.svg?react";
import Flex from "@/components/Flex";
import { AppRoutes } from "@/types";
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426

const Lobby: FC = () => {
	useDocumentTitle("Лобби");

	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Что дальше?">
<<<<<<< HEAD
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
=======
			<PickedPartner userId={pickedPartner} />
			<Flex column gap={8}>
				<Button to={AppRoutes.FilmList} icon={DiceIcon}>
					Выбрать фильм
				</Button>
				<Button to={AppRoutes.AddFilm} style="secondary" icon={AddIcon}>
					Добавить фильм
				</Button>
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426
			</Flex>
		</Dialog>
	);
};

export default Lobby;
