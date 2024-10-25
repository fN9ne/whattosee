import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import Input from "@/components/UI/Input";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useInput } from "@/hooks/useInput";
import { FC, useEffect, useState } from "react";

import AddIcon from "@icons/add.svg?react";
import ListIcon from "@icons/list.svg?react";
import { AppRoutes } from "@/types";
import { IDuetFilm, IFilm, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import Loader from "@/components/UI/Loader";

const FilmAdd: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);
	const { user } = useAppSelector((state) => state.user);
	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();
	const [isFetching, setIsFetching] = useState<boolean>(false);

	useEffect(() => {
		setIsFetching(readLoading || updateLoading);
	}, [readLoading, updateLoading]);

	const filmName = useInput("", {});

	const handleAddFilm = async () => {
		if (filmName.value && user) {
			try {
				setIsFetching(true);

				const response = await triggerRead().unwrap();

				const newItemId = response.items.length > 0 ? response.items[response.items.length - 1].id + 1 : 0;
				const newItem: IFilm = {
					id: newItemId,
					name: filmName.value,
					owner: user.id,
				};

				const newItems = [...response.items, newItem];

				const currentDuet = response.duets.find(
					(duet) =>
						(duet.firstUser === user.id && duet.secondUser === pickedPartner) ||
						(duet.firstUser === pickedPartner && duet.secondUser === user.id)
				);

				if (currentDuet) {
					const newDuetItem: IDuetFilm = {
						filmId: newItem.id,
						owner: newItem.owner,
					};

					const newDuet = {
						...currentDuet,
						items: [...currentDuet.items, newDuetItem],
					};
					const newDuets = response.duets.map((duet) => (duet.id === currentDuet.id ? newDuet : duet));

					const newData = {
						...response,
						items: newItems,
						duets: newDuets,
					};

					await updateData(newData)
						.unwrap()
						.then((response) => console.log(response));
				} else {
					console.error("Ошибка. Дуэта не существует.");
				}
			} catch (error) {
				console.error("Ошибка при добавлении фильма:", error);
			}
		}
	};

	return (
		<Dialog showBackLink title="Добавить фильм">
			<Loader isLoading={isFetching} dark absolute />
			<PickedPartner userId={pickedPartner} />
			<Flex column gap={8}>
				<Input value={filmName.value} onChange={filmName.onChange} placeholder=" Фильм..." />
				<Button onClick={handleAddFilm} icon={AddIcon}>
					Добавить
				</Button>
				<Button to={AppRoutes.PickFilm} style="secondary" icon={ListIcon}>
					Выбрать из базы
				</Button>
			</Flex>
		</Dialog>
	);
};

export default FilmAdd;
