import Flex from "@/components/Flex";
import Track from "@/components/Track";
import Avatar from "@/components/UI/Avatar";
import Dialog from "@/components/UI/Dialog";
import Loader from "@/components/UI/Loader";
import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IDuet, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { AppRoutes } from "@/types";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PickPartner: FC = () => {
	useDocumentTitle("Выбор дуэта");

	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();
	const { setPickedPartner } = useActions();
<<<<<<< HEAD
	const { users, duets } = useAppSelector((state) => state.data);
	const { user } = useAppSelector((state) => state.user);
=======
	const { user } = useAppSelector((state) => state.user);
	const { users } = useAppSelector((state) => state.data);
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426
	const navigate = useNavigate();

	useEffect(() => {
		triggerRead();
	}, []);

	const handlePickPartner = async (id: number) => {
		setPickedPartner(id);

		const addDuet = async (duet: IDuet) => {
			try {
				const response = await triggerRead().unwrap();

				await updateData({ ...response, duets: [...response.duets, duet] });
			} catch (error) {
				console.error("Ошибка при создании нового дуэта.");
			}
		};

		if (user) {
			const currentDuet = duets.find(
				(duet) => (duet.firstUser === user.id && duet.secondUser === id) || (duet.firstUser === id && duet.secondUser === user.id)
			);

			if (!currentDuet) {
				const newDuetId = duets.length > 0 ? duets[duets.length - 1].id + 1 : 0;

				const newDuet: IDuet = {
					id: newDuetId,
					firstUser: user.id,
					secondUser: id,
					items: [],
					watched: [],
				};

				await addDuet(newDuet);
			}
		}

		navigate(AppRoutes.Lobby);
	};

	return (
		<Dialog showBackLink title="Выбор дуэта" description="Выберите того с кем хотите что-то посмотреть.">
			<Loader isLoading={updateLoading || readLoading} dark absolute />
			<Track column gap={4}>
				{users
					.filter((userItem) => userItem.id !== user?.id)
					.map((user, index) => (
						<User onClick={() => handlePickPartner(user.id)} gap={16} alignItems="center" key={index}>
<<<<<<< HEAD
							<Avatar colorId={user.color} symbol={user.name.charAt(0)} />
=======
							<Avatar size="large" colorId={user.color} symbol={user.name.charAt(0)} />
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426
							<span>{user.name}</span>
						</User>
					))}
			</Track>
		</Dialog>
	);
};

export default PickPartner;

/* components */

const User = styled(Flex)`
	background-color: var(--black);
	border-radius: 40px;
	padding: 8px 24px 8px 8px;
	transition: 200ms;
	font-weight: 700;
	font-size: 20px;
	color: white;
	cursor: pointer;
<<<<<<< HEAD

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 0.5;
		}
	}
=======
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426

	span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 0.6;
		}
	}

	&:active {
<<<<<<< HEAD
		border-color: var(--primary);
		opacity: 1;
=======
		opacity: 0.35;
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426
	}
`;
