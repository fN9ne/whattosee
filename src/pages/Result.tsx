import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { AppRoutes } from "@/types";
import { FC, useEffect, useState } from "react";

import HomeIcon from "@icons/home.svg?react";
import { IDuet, IFilm, IUser, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { useAppSelector } from "@/hooks/useAppSelector";
import styled, { keyframes } from "styled-components";
import Flex from "@/components/Flex";
import Avatar from "@/components/UI/Avatar";

import { AnimatePresence as AP, motion as m } from "framer-motion";

import SkipIcon from "@icons/skip.svg?react";
import { getDuetByUserIds } from "@/functions";
import { useActions } from "@/hooks/useActions";
import Loader from "@/components/UI/Loader";
import { useNavigate } from "react-router-dom";

const Result: FC = () => {
	const { result, pickedPartner } = useAppSelector((state) => state.global);
	const { user } = useAppSelector((state) => state.user);

	const { setResult, setUser } = useActions();

	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();

	const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		setIsFetching(readLoading || updateLoading);
	}, [readLoading, updateLoading]);

	const getRandomFilm = async () => {
		if (pickedPartner !== null && user) {
			try {
				setIsAnimationPlaying(true);

				const response = await triggerRead().unwrap();

				const { items, duets } = response;

				const currentDuet = getDuetByUserIds(duets, user.id, pickedPartner);

				if (currentDuet) {
					const queuedFilms = currentDuet.items;

					const resultedFilm = queuedFilms[Math.floor(Math.random() * queuedFilms.length)];

					setResult(items.find((film) => film.id === resultedFilm.filmId) || null);

					setTimeout(() => {
						setIsAnimationPlaying(false);
					}, 1000);
				}
			} catch (error) {
				console.error("Ошибка при выборе фильма", error);
			}
		}
	};

	const saveData = async () => {
		if (pickedPartner !== null && user && result !== null) {
			try {
				setIsFetching(true);

				const response = await triggerRead().unwrap();

				const { duets, users, items } = response;

				const currentDuet = getDuetByUserIds(duets, pickedPartner, user.id);

				if (currentDuet) {
					const newDuet: IDuet = {
						...currentDuet,
						items: currentDuet.items.filter((film) => film.filmId !== result.id),
						watched: [...currentDuet.watched, { filmId: result.id, owner: result.owner }],
					};

					const newDuets = duets.map((duet) => (duet.id === currentDuet.id ? newDuet : duet));

					const newCurrentUser: IUser = {
						...user,
						latest: {
							duets: [pickedPartner, ...user.latest.duets]
								.slice(0, 2)
								.filter((userId, index, array) => array.indexOf(userId) === index),
							films: [{ filmId: result.id, owner: pickedPartner }, ...user.latest.films].slice(0, 5),
						},
					};

					const desiredPartner = users.find((user) => user.id === pickedPartner);

					if (desiredPartner) {
						const newPartner: IUser = {
							...desiredPartner,
							latest: {
								duets: [user.id, ...desiredPartner.latest.duets]
									.slice(0, 2)
									.filter((userId, index, array) => array.indexOf(userId) === index),
								films: [{ filmId: result.id, owner: user.id }, ...desiredPartner.latest.films].slice(0, 5),
							},
						};

						const newUsers = users.map((userItem) =>
							userItem.id === user.id ? newCurrentUser : userItem.id === pickedPartner ? newPartner : userItem
						);

						setUser(newCurrentUser);

						await updateData({ ...response, duets: newDuets, users: newUsers }).then(() => {
							setResult(items.find((film) => film.id === result.id) || null);
							navigate(AppRoutes.Home);
						});
					} else {
						console.error("Ошибка при поиске партнёра");
					}
				} else {
					console.error("Ошибка при поиске дуэта");
				}
			} catch (error) {
				console.error("Ошибка при сохранении данных :(((((", error);
			}
		}
	};

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<Dialog showBackLink title="Приятного просмотра!" description="Колесо фортуны выбрало для вас:">
			<Loader isLoading={isFetching} dark absolute />
			<AP mode="wait" initial={false}>
				{isAnimationPlaying && (
					<AnimationContainer {...transitions}>
						<div>?</div>
						<div>?</div>
						<div>?</div>
					</AnimationContainer>
				)}
			</AP>
			<Flex column gap={12}>
				{result !== null && <Item {...result} />}
				<Button onClick={getRandomFilm} icon={SkipIcon}>
					Пропустить
				</Button>
				<Button onClick={saveData} style="secondary" icon={HomeIcon}>
					Оставить
				</Button>
			</Flex>
		</Dialog>
	);
};

export default Result;

/* components */

const QuestSymbolAnimation = keyframes`
0%, 60%, 100% {
	translate: 0 0;
}
10%, 70% {
	translate: 4px 2px;
}
20%, 80% {
	translate: -2px 5px;
}
30%, 90% {
	translate: 1px -3px;
}
40% {
	translate: -4px -2px;
}
50% {
	translate: 1px 2px;
}
`;
const QuestSymbolAnimation2 = keyframes`
to {
	rotate: 360deg;
}
`;

const AnimationContainer = styled(m.div)`
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	z-index: 108;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--gray);

	div {
		position: absolute;
		font-weight: 900;
		color: var(--primary);

		&:first-child {
			left: calc(50% - 75px);
			font-size: 40px;
			animation: ${QuestSymbolAnimation} 3.2s linear infinite 0.25s, ${QuestSymbolAnimation2} 1s infinite 0.1s;
		}
		&:nth-child(2) {
			font-size: 90px;
			animation: ${QuestSymbolAnimation} 3s linear infinite, ${QuestSymbolAnimation2} 1.15s infinite;
		}
		&:last-child {
			left: calc(50% + 50px);
			font-size: 52px;
			animation: ${QuestSymbolAnimation} 2.7s linear infinite 0.1s, ${QuestSymbolAnimation2} 0.9s infinite 0.3s;
		}
	}
`;

const Item: FC<IFilm> = ({ name, owner }) => {
	const { users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === owner);

	return (
		user && (
			<StyledItem justifyContent="space-between" alignItems="center" gap={20}>
				<span>{name}</span>
				<Avatar colorId={user.color} symbol={user.name.charAt(0)} />
			</StyledItem>
		)
	);
};

const StyledItem = styled(Flex)`
	background-color: var(--black);
	border-radius: 33px;
	padding: 8px 8px 8px 24px;
	font-size: 18px;
	font-weight: 700;
	color: white;

	span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;
