import Flex from "@/components/Flex";
import Avatar from "@/components/UI/Avatar";
import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import Input from "@/components/UI/Input";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useInput } from "@/hooks/useInput";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";

import CheckIcon from "@icons/check.svg?react";
import CancelIcon from "@icons/close.svg?react";
import { IUser, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { useActions } from "@/hooks/useActions";
import Loader from "@/components/UI/Loader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Profile: FC = () => {
	useDocumentTitle("Профиль");

	const { user } = useAppSelector((state) => state.user);

	const [initialUserData, setInitialUserData] = useState<IUser | null>(null);

	const [isFetching, setIsFetching] = useState<boolean>(false);

	const name = useInput("", {});
	const [pickedColor, setPickedColor] = useState<number>(1);

	useEffect(() => {
		if (user) {
			setInitialUserData(user);
			name.onChange(user.name);
			setPickedColor(user.color);
		}
	}, [user]);

	const colorIds = [1, 2, 3, 4, 5, 6, 7, 8];

	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();

	useEffect(() => {
		setIsFetching(readLoading || updateLoading);
	}, [readLoading, updateLoading]);

	const { setUser } = useActions();

	const isDataChanged = (): boolean => {
		if (initialUserData) {
			return name.value !== initialUserData.name || pickedColor !== initialUserData.color;
		}

		return false;
	};

	const handleSave = async () => {
		if (user) {
			try {
				setIsFetching(true);

				const response = await triggerRead().unwrap();

				const newUserData = {
					id: user.id,
					name: name.value,
					color: pickedColor,
					latest: user.latest,
				};

				const newUsers = response.users.map((userItem) => (userItem.id === user.id ? newUserData : userItem));
				const newData = { ...response, users: newUsers };

				await updateData(newData).unwrap();

				setUser(newUserData);
			} catch (error) {
				console.error("Ошибка при сохраненнии данных профиля:", error);
			}
		}
	};
	const handleCancel = () => {
		if (initialUserData) {
			name.onChange(initialUserData.name);
			setPickedColor(initialUserData.color);
		}
	};

	return (
		<Dialog title="Профиль">
			<Loader isLoading={!user || isFetching} absolute dark />
			{user && (
				<>
					<Flex column gap={16}>
						<Flex column gap={8}>
							<Placeholder>Изменить имя</Placeholder>
							<Input value={name.value} onChange={name.onChange} placeholder=" Вас зовут..." />
						</Flex>
						<Flex column gap={8}>
							<Placeholder>Изменить цвет</Placeholder>
							<Flex wrap itemsPerRow={4} gap={12}>
								{colorIds.map((id, index) => (
									<Avatar
										picked={pickedColor === id}
										setPicked={() => setPickedColor(id)}
										colorId={id}
										key={index}
										responsive
										symbol={name.value.charAt(0).toUpperCase()}
									/>
								))}
							</Flex>
						</Flex>
					</Flex>
					<Flex column gap={8}>
						<Button onClick={handleSave} disabled={!isDataChanged()} icon={CheckIcon}>
							Сохранить
						</Button>
						<Button onClick={handleCancel} style="secondary" disabled={!isDataChanged()} icon={CancelIcon}>
							Отменить
						</Button>
					</Flex>
				</>
			)}
		</Dialog>
	);
};

export default Profile;

/* components */

const Placeholder = styled.div`
	font-family: "Fira Sans Condensed", sans-serif;
	font-size: 20px;
	color: rgba(255, 255, 255, 0.5);
`;
