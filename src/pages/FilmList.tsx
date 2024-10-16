import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FC } from "react";

const FilmList: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);
	const { users } = useAppSelector((state) => state.data);

	const partner = users.find((user) => user.id === pickedPartner);

	useDocumentTitle(`Список фильмов${partner && ` с «${partner.name}»`}`);

	return (
		<Dialog showBackLink title="Ваш список фильмов">
			<Flex column gap={20}>
				<PickedPartner userId={pickedPartner} />
			</Flex>
		</Dialog>
	);
};

export default FilmList;
