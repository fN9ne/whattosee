import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import Loader from "@/components/UI/Loader";
import { useAppSelector } from "@/hooks/useAppSelector";
import { IUser, useLazyReadQuery } from "@/services/api";
import { FC, useEffect, useState } from "react";

import SlideArrowLeft from "@/assets/slideArrowLeft.svg?react";
import SlideArrowRight from "@/assets/slideArrowRight.svg?react";
import Flex from "@/components/Flex";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import Avatar from "@/components/UI/Avatar";
import { useActions } from "@/hooks/useActions";
import { AppRoutes } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

/* main */

const Login: FC = () => {
	useDocumentTitle("Вход");

	const { users } = useAppSelector((state) => state.data);

	const { setUser } = useActions();

	const [isUsersHave, setIsUserHave] = useState<boolean>(false);
	const [pickedUser, setPickedUser] = useState<IUser | null>(null);

	const [triggerRead, { isFetching }] = useLazyReadQuery();

	const navigate = useNavigate();

	const handleLogin = () => {
		if (pickedUser) {
			setUser(pickedUser);
			localStorage.setItem("userId", JSON.stringify(pickedUser.id));
			navigate(AppRoutes.Home);
		}
	};

	useEffect(() => {
		triggerRead();
	}, []);

	useEffect(() => {
		if (!isFetching) setIsUserHave(users.length > 0);
	}, [users]);

	return (
		<Dialog
			showBackLink
			title="Вход"
			description={
				!isFetching
					? isUsersHave
						? "Убедительная просьба не входить под чужие учётные записи, спасибо!"
						: "К сожалению у меня не получилось найти ни одной учётной записи."
					: undefined
			}
		>
			<Loader absolute dark isLoading={isFetching} />
			<Flex column alignItems="start">
				{!isFetching &&
					(isUsersHave ? (
						<Content column gap={32} alignItems="end">
							<Track column gap={4}>
								{users.map((user, index) => (
									<UserItem
										onClick={() => setPickedUser(user)}
										picked={pickedUser?.id === user.id}
										gap={16}
										alignItems="center"
										key={index}
									>
										<Avatar size="large" symbol={user.name.charAt(0)} colorId={user.color} />
										<span>{user.name}</span>
									</UserItem>
								))}
							</Track>
							<Button
								disabled={pickedUser === null}
								style="secondary"
								onClick={handleLogin}
								slide={{
									element:
										pickedUser === null ? (
											<SlideArrowRight />
										) : (
											<Avatar size="large" symbol={pickedUser.name.charAt(0)} colorId={pickedUser.color} />
										),
								}}
							>
								Войти
							</Button>
						</Content>
					) : (
						<Button onClick={() => navigate(-1)} style="secondary" slide={{ element: <SlideArrowLeft />, position: "left" }}>
							Назад
						</Button>
					))}
			</Flex>
		</Dialog>
	);
};

export default Login;

/* components */

const Content = styled(Flex)`
	width: 100%;
`;

const Track = styled(Flex)`
	width: 100%;
	overflow: auto;
	max-height: 300px;
	padding: 0 8px 0 0;
	&::-webkit-scrollbar {
		width: 4px;

		&-thumb {
			background-color: #575757;
			border-radius: 2px;
		}
	}
`;

interface UserItemProps {
	picked: boolean;
}

const shouldForwardProp = (prop: string) => !["picked"].includes(prop);

const UserItem = styled(Flex).withConfig({ shouldForwardProp })<UserItemProps>`
	background-color: var(--black);
	height: 80px;
	padding: 8px 24px 8px 8px;
	border-radius: 40px;
	font-size: 20px;
	font-weight: 700;
	color: white;
	cursor: pointer;
	opacity: 0.25;
	transition: 200ms;

	${(props) =>
		props.picked
			? "opacity: 1"
			: css`
					@media (hover: hover) and (pointer: fine) {
						&:hover {
							opacity: 0.5;
						}
					}

					&:active {
						opacity: 0.75;
					}
			  `};

	span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;
