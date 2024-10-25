import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC, useEffect, useState } from "react";

import AddIcon from "@icons/add.svg?react";
import ListIcon from "@icons/list.svg?react";
import { AppRoutes } from "@/types";
import Input from "@/components/UI/Input";
import { useInput } from "@/hooks/useInput";
import { useAlert } from "@/hooks/useAlert";
import { IDuet, IFetchData, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import Loader from "@/components/UI/Loader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const AddFilm: FC = () => {
	useDocumentTitle("Добавление фильма");

	const { pickedPartner } = useAppSelector((state) => state.global);
	const { user } = useAppSelector((state) => state.user);
	const triggerAlert = useAlert();
	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const filmName = useInput("", {});

	useEffect(() => {
		setIsFetching(readLoading || updateLoading);
	}, [readLoading, updateLoading]);

	const handleAddFilm = async () => {
		if (filmName.value && user && pickedPartner !== null) {
			setIsFetching(true);

			const response = await triggerRead().unwrap();

			const oldFilm = response.items.find((film) => film.name.toLowerCase() === filmName.value.toLowerCase());
			const isFilmUnique = !Boolean(oldFilm);
			const newItemId = isFilmUnique
				? response.items.length > 0
					? response.items[response.items.length - 1].id + 1
					: 0
				: oldFilm?.id || 0;
			const newItem = { id: newItemId, name: filmName.value.charAt(0) + filmName.value.slice(1), owner: user.id };
			const newItems = isFilmUnique ? [...response.items, newItem] : response.items;

			const currentDuet = response.duets.find(
				(duet) =>
					(duet.firstUser === user.id && duet.secondUser === pickedPartner) ||
					(duet.firstUser === pickedPartner && duet.secondUser === user.id)
			);

			if (currentDuet) {
				const desiredFilm = response.items.find((item) => item.name.toLowerCase() === filmName.value.toLowerCase());

				if (desiredFilm) {
					const desiredDuetFilm =
						currentDuet.watched.find((film) => film.filmId === desiredFilm.id) ||
						currentDuet.items.find((film) => film.filmId === desiredFilm.id);

					if (desiredDuetFilm) {
						setIsFetching(false);
						triggerAlert(`"${desiredFilm.name}" уже в вашем списке.`, "error");
						return;
					}
				}
			}

			const newDuetId = response.duets.length > 0 ? response.duets[response.duets.length - 1].id + 1 : 0;

			const newDuet: IDuet = !currentDuet
				? {
						id: newDuetId,
						firstUser: user.id,
						secondUser: pickedPartner,
						items: newItems.map((item) => ({ filmId: item.id, owner: item.owner })),
						watched: [],
				  }
				: {
						...currentDuet,
						items: [
							...currentDuet.items,
							{
								filmId: isFilmUnique ? newItemId : oldFilm?.id || 0,
								owner: user.id,
							},
						],
				  };

			const newDuets = !currentDuet
				? [...response.duets, newDuet]
				: response.duets.map((duet) => (duet.id === currentDuet.id ? newDuet : duet));

			const newData: IFetchData = {
				users: response.users,
				items: newItems,
				duets: newDuets,
			};

			await updateData(newData).then(() => triggerAlert(`"${filmName.value}" успешно добавлен.`, "success"));

			filmName.onChange("");
		}
	};

	return (
		<Dialog showBackLink title="Добавить фильм">
			<Loader isLoading={isFetching} absolute dark />
			<Flex column gap={20}>
				<PickedPartner userId={pickedPartner} />
				<Flex column gap={8}>
					<Input value={filmName.value} onChange={filmName.onChange} placeholder=" Фильм..." />
					<Button disabled={!filmName.value} onClick={handleAddFilm} icon={AddIcon}>
						Добавить
					</Button>
					<Button to={AppRoutes.PickFilm} style="secondary" icon={ListIcon}>
						Выбрать из базы
					</Button>
				</Flex>
			</Flex>
		</Dialog>
	);
};

export default AddFilm;
