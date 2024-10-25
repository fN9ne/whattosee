<<<<<<< HEAD
import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import Tab from "@/components/UI/Tab";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IDuet, IDuetFilm, IFilm, IUser, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { FC, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import Avatar from "@/components/UI/Avatar";
import { Description } from "@/components/UI/Typographic";
import Button from "@/components/UI/Button";

import DiceIcon from "@icons/dice.svg?react";
import { getDuetByUserIds } from "@/functions";
import { AppRoutes } from "@/types";
import { useNavigate } from "react-router-dom";
import { useActions } from "@/hooks/useActions";

const FilmList: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);
	const { users, duets, items } = useAppSelector((state) => state.data);
	const { user } = useAppSelector((state) => state.user);

	const partner = users.find((user) => user.id === pickedPartner);

	useDocumentTitle(`Список фильмов${partner && ` с «${partner.name}»`}`);

	interface ITab {
		isActive: boolean;
		name: string;
		notification?: number;
	}

	const { setResult, setUser } = useActions();
	const [filmList, setFilmList] = useState<IFilm[]>([]);
	const [watchedFilmList, setWatchedFilmList] = useState<IFilm[]>([]);
	const [currentDuet, setCurrentDuet] = useState<IDuet | null>(null);
	const [tabs, setTabs] = useState<ITab[]>([
		{
			isActive: true,
			name: "На очереди",
		},
		{
			isActive: false,
			name: "Просмотрено",
		},
	]);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);
	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();
	const navigate = useNavigate();

	useEffect(() => {
		setIsFetching(readLoading || updateLoading);
	}, [readLoading, updateLoading]);

	useEffect(() => {
		if (user && pickedPartner !== null && duets.length > 0) {
			setCurrentDuet(
				duets.find(
					(duet) =>
						(duet.firstUser === user.id && duet.secondUser === pickedPartner) ||
						(duet.firstUser === pickedPartner && duet.secondUser === user.id)
				) || null
			);
		}
	}, [user, pickedPartner, duets]);

	useEffect(() => {
		if (currentDuet) {
			setTabs((state) =>
				state.map((tab) => ({
					...tab,
					notification:
						tab.name === "На очереди"
							? currentDuet.items.length
							: tab.name === "Просмотрено"
							? currentDuet.watched.length
							: undefined,
				}))
			);
		}
	}, [currentDuet]);

	useEffect(() => {
		if (items.length > 0 && currentDuet) {
			const getFilms = (filmList: IDuetFilm[]): IFilm[] => {
				return filmList
					.map((item) => {
						const currentItem = items.find((film) => film.id === item.filmId);

						return currentItem ? currentItem : null;
					})
					.filter((item) => item !== null);
			};

			setFilmList(getFilms(currentDuet.items));
			setWatchedFilmList(getFilms(currentDuet.watched));
		}
	}, [items, currentDuet]);

	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	const transitions2 = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const getRandomFilm = async () => {
		if (pickedPartner !== null && user) {
			try {
				setIsFetching(true);
				setIsAnimationPlaying(true);

				const response = await triggerRead().unwrap();

				const { duets, items, users } = response;

				const currentDuet = getDuetByUserIds(duets, user.id, pickedPartner);

				if (currentDuet) {
					/* duets */

					const queuedFilms = currentDuet.items;

					const resultedFilm = queuedFilms[Math.floor(Math.random() * queuedFilms.length)];

					const newDuet: IDuet = {
						...currentDuet,
						items: currentDuet.items.filter((film) => film.filmId !== resultedFilm.filmId),
						watched: [...currentDuet.watched, resultedFilm],
					};
					const newDuets = duets.map((duet) => (duet.id === currentDuet.id ? newDuet : duet));

					/* users */

					const newCurrentUser: IUser = {
						...user,
						latest: {
							duets: [pickedPartner, ...user.latest.duets]
								.slice(0, 2)
								.filter((userId, index, array) => array.indexOf(userId) === index),
							films: [{ ...resultedFilm, owner: pickedPartner }, ...user.latest.films].slice(0, 5),
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
								films: [{ ...resultedFilm, owner: user.id }, ...desiredPartner.latest.films].slice(0, 5),
							},
						};

						const newUsers = users.map((userItem) =>
							userItem.id === user.id ? newCurrentUser : userItem.id === pickedPartner ? newPartner : userItem
						);

						setUser(newCurrentUser);

						/* update data */

						await updateData({ ...response, duets: newDuets, users: newUsers }).then(() => {
							setResult(items.find((film) => film.id === resultedFilm.filmId) || null);

							setTimeout(() => {
								navigate(AppRoutes.Result);
							}, 2500);
						});
					} else {
						console.error("Ошибка при поиске партнёра.");
					}
				}
			} catch (error) {
				console.error("Ошибка при получении случайного фильма.", error);
			}
		}
	};

	return (
		<Dialog showBackLink={!isAnimationPlaying} title="Ваш список фильмов">
			<Flex column gap={20}>
				<AP mode="wait" initial={false}>
					{(isFetching || isAnimationPlaying) && (
						<AnimationContainer {...transitions2}>
							<div>?</div>
							<div>?</div>
							<div>?</div>
						</AnimationContainer>
					)}
				</AP>
				<PickedPartner userId={pickedPartner} />
				<Flex column gap={12}>
					<TabContainer gap={4} justifyContent="space-between">
						{tabs.map((tab, index) => (
							<Tab
								onClick={() =>
									setTabs((state) =>
										state.map((tab, subIndex) => (subIndex === index ? { ...tab, isActive: true } : { ...tab, isActive: false }))
									)
								}
								{...tab}
								key={index}
							/>
						))}
					</TabContainer>
					<AP mode="wait" initial={false}>
						{tabs.find((tab) => tab.isActive)?.name === "Просмотрено" ? (
							<m.div key="watched" {...transitions}>
								<Track column gap={4}>
									{watchedFilmList.length > 0 ? (
										watchedFilmList.map((film) => <Item {...film} key={film.name} />)
									) : (
										<Description>В списке «{tabs.find((tab) => tab.isActive)?.name}» пока что нет фильмов.</Description>
									)}
								</Track>
							</m.div>
						) : (
							<m.div key="onList" {...transitions}>
								<Track column gap={4}>
									{filmList.length > 0 ? (
										filmList.map((film) => <Item {...film} key={film.name} />)
									) : (
										<Description>В списке «{tabs.find((tab) => tab.isActive)?.name}» пока что нет фильмов.</Description>
									)}
								</Track>
							</m.div>
						)}
					</AP>
				</Flex>
				<Button onClick={getRandomFilm} disabled={filmList.length === 0} icon={DiceIcon}>
					Выбрать фильм
				</Button>
			</Flex>
=======
import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FC } from "react";

const FilmList: FC = () => {
	const { pickedPartner } = useAppSelector((state) => state.global);

	return (
		<Dialog showBackLink title="Ваш список фильмов">
			<PickedPartner userId={pickedPartner} />
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426
		</Dialog>
	);
};

export default FilmList;
<<<<<<< HEAD

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

const TabContainer = styled(Flex)`
	padding: 0 0 8px 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Track = styled(Flex)`
	max-height: 300px;
	overflow: auto;
	padding: 0 10px 0 0;

	&::-webkit-scrollbar {
		width: 5px;

		&-thumb {
			background-color: #777;
		}
	}
`;

const Item: FC<IFilm> = ({ name, owner }) => {
	const { users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === owner);

	return (
		user && (
			<StyledItem justifyContent="space-between" gap={12} alignItems="center">
				<span>{name}</span>
				<Avatar size="small" colorId={user.color} symbol={user.name.charAt(0)} />
			</StyledItem>
		)
	);
};

const StyledItem = styled(Flex)`
	background-color: var(--black);
	padding: 2px 2px 2px 16px;
	border-radius: 22px;
	font-size: 16px;
	font-weight: 600;
	color: white;

	span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;
=======
>>>>>>> 32e4c30de3286aba2783714501254ebce3af7426
