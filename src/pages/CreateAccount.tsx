import { FC, useState } from "react";

import Dialog from "@/components/UI/Dialog";
import Flex from "@/components/Flex";
import Input from "@/components/UI/Input";
import { H3 } from "@/components/UI/Typographic";
import Avatar from "@/components/UI/Avatar";
import { useInput } from "@/hooks/useInput";
import Button from "@/components/UI/Button";

import SlideArrowRight from "@/assets/slideArrowRight.svg?react";
import { IUser, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { useActions } from "@/hooks/useActions";
import { AppRoutes } from "@/types";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/UI/Loader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CreateAccount: FC = () => {
	useDocumentTitle("Создание аккаунта");

	const name = useInput("", {});

	const { setUser, setUserId } = useActions();

	const navigate = useNavigate();

	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();

	const avatarIds = [1, 2, 3, 4, 5, 6, 7, 8];

	const [pickedAvatarId, setPickedAvatarId] = useState<number | null>(null);

	const handleCreateAccount = async () => {
		try {
			const response = await triggerRead().unwrap();

			const newUserId = response.users[response.users.length - 1].id + 1;
			const newUser: IUser = {
				id: newUserId,
				name: name.value.charAt(0).toUpperCase() + name.value.slice(1),
				color: pickedAvatarId || 0,
				latest: {
					duets: [],
					films: [],
				},
			};

			const newUsers = [...response.users, newUser];
			const newData = { ...response, users: newUsers };

			await updateData(newData).unwrap();

			localStorage.setItem("userId", JSON.stringify(newUserId));
			setUser(newUser);
			setUserId(newUserId);
			navigate(AppRoutes.Home);
		} catch (error) {
			console.error("Ошибка при создании аккаунта:", error);
		}
	};

	return (
		<Dialog showBackLink title="Создание аккаунта" description="Мне понадобится твоё имя и желаемый цвет, только и всего!">
			<Loader absolute dark isLoading={readLoading || updateLoading} />
			<Input placeholder=" Вас зовут..." value={name.value} onChange={name.onChange} />
			<Flex column gap={20}>
				<H3>Выберите цвет</H3>
				<Flex wrap itemsPerRow={4} gap={12}>
					{avatarIds.map((id, index) => (
						<Avatar
							picked={pickedAvatarId === id}
							setPicked={() => setPickedAvatarId(id)}
							colorId={+id}
							symbol={name.value.charAt(0) || "?"}
							responsive
							key={index}
						/>
					))}
				</Flex>
			</Flex>
			<Flex justifyContent="end">
				<Button
					onClick={handleCreateAccount}
					disabled={pickedAvatarId === null || !name.value}
					style="secondary"
					slide={{ element: <SlideArrowRight /> }}
				>
					Создать
				</Button>
			</Flex>
		</Dialog>
	);
};

export default CreateAccount;
