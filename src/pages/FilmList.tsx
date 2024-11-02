import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Dialog from "@/components/UI/Dialog";
import Tab from "@/components/UI/Tab";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IDuet, IDuetFilm, IFilm, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { FC, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import Avatar from "@/components/UI/Avatar";
import { Description } from "@/components/UI/Typographic";
import Button from "@/components/UI/Button";

import EyeIcon from "@icons/visibility.svg?react";
import DiceIcon from "@icons/dice.svg?react";
import { getDuetByUserIds } from "@/functions";
import { AppRoutes } from "@/types";
import { useNavigate } from "react-router-dom";
import { useActions } from "@/hooks/useActions";
import Loader from "@/components/UI/Loader";

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

	const { setResult } = useActions();
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
	const [triggerRead] = useLazyReadQuery();
	const [clickedItem, setClickedItem] = useState<IFilm | null>(null);
	const [contextMenuPos, setContextMenuPos] = useState<Pick<ContextMenuProps, "x" | "y">>({ x: 0, y: 0 });
	const navigate = useNavigate();

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

				const { items, duets } = response;

				const currentDuet = getDuetByUserIds(duets, user.id, pickedPartner);

				if (currentDuet) {
					const queuedFilms = currentDuet.items;

					const resultedFilm = queuedFilms[Math.floor(Math.random() * queuedFilms.length)];

					setResult(items.find((film) => film.id === resultedFilm.filmId) || null);

					setTimeout(() => {
						navigate(AppRoutes.Result);
					}, 2500);
				}
			} catch (error) {
				console.error("Ошибка при выборе фильма", error);
			}
		}
	};

	const handleContextMenu = (film: IFilm, position: Pick<ContextMenuProps, "x" | "y">) => {
		setClickedItem(film);
		setContextMenuPos(position);
	};

	return (
		<>
			<Dialog showBackLink={!isAnimationPlaying} title="Ваш список фильмов">
				<Loader isLoading={isFetching} dark absolute />
				<Flex column gap={20}>
					<AP mode="wait" initial={false}>
						{isAnimationPlaying && (
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
											state.map((tab, subIndex) =>
												subIndex === index ? { ...tab, isActive: true } : { ...tab, isActive: false }
											)
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
											watchedFilmList.map((film) => (
												<Item
													isClicked={clickedItem?.id === film.id}
													onContextMenu={handleContextMenu}
													{...film}
													key={film.name}
												/>
											))
										) : (
											<Description>В списке «{tabs.find((tab) => tab.isActive)?.name}» пока что нет фильмов.</Description>
										)}
										<AP mode="wait" initial={false}>
											{clickedItem !== null && (
												<>
													<StyledContextContainer {...transitions2} />
													<ContextMenu
														listType="watched"
														setIsFetching={setIsFetching}
														clickedFilm={clickedItem}
														{...contextMenuPos}
														{...transitions}
														onClose={() => setClickedItem(null)}
													/>
												</>
											)}
										</AP>
									</Track>
								</m.div>
							) : (
								<m.div key="onList" {...transitions}>
									<Track column gap={4}>
										{filmList.length > 0 ? (
											filmList.map((film) => (
												<Item
													isClicked={clickedItem?.id === film.id}
													onContextMenu={handleContextMenu}
													{...film}
													key={film.name}
												/>
											))
										) : (
											<Description>В списке «{tabs.find((tab) => tab.isActive)?.name}» пока что нет фильмов.</Description>
										)}
										<AP mode="wait" initial={false}>
											{clickedItem !== null && (
												<>
													<StyledContextContainer {...transitions2} />
													<ContextMenu
														listType="queue"
														setIsFetching={setIsFetching}
														clickedFilm={clickedItem}
														{...contextMenuPos}
														{...transitions}
														onClose={() => setClickedItem(null)}
													/>
												</>
											)}
										</AP>
									</Track>
								</m.div>
							)}
						</AP>
					</Flex>
					<Button onClick={getRandomFilm} disabled={filmList.length === 0} icon={DiceIcon}>
						Выбрать фильм
					</Button>
				</Flex>
			</Dialog>
		</>
	);
};

export default FilmList;

/* components */

const StyledContextMenuItem = styled(Flex).attrs({ as: "button" })`
	width: 150px;
	border-radius: 8px;
	font-size: 16px;
	padding: 12px;
	background-color: transparent;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	transition: 200ms;

	> svg {
		width: 1em;
		height: 1em;

		path {
			transition: 200ms;
			fill: rgba(255, 255, 255, 0.5);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			color: white;
			background-color: #303030;

			svg path {
				fill: white;
			}
		}
	}

	&:active {
		color: white;
		background-color: #303030;

		svg path {
			fill: white;
		}
	}
`;

const StyledContextContainer = styled(m.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 12;
	background-color: rgba(0, 0, 0, 0.75);
`;

interface ContextMenuProps {
	listType: "queue" | "watched";
	clickedFilm: IFilm;
	onClose: () => void;
	setIsFetching: (value: boolean) => void;
	x: number;
	y: number;
}

const shouldForwardProp = (prop: string) => !["x", "y"].includes(prop);

const ContextMenu: FC<ContextMenuProps> = ({ onClose, setIsFetching, listType, ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const { pickedPartner } = useAppSelector((state) => state.global);
	const { user } = useAppSelector((state) => state.user);

	const [triggerRead] = useLazyReadQuery();
	const [updateData] = useUpdateMutation();

	useEffect(() => {
		const handleCloseDropdown = (event: MouseEvent) => {
			const target = event.target as Node;

			if (containerRef.current && !containerRef.current.contains(target)) {
				onClose();
			}
		};

		document.addEventListener("click", handleCloseDropdown);

		return () => document.removeEventListener("click", handleCloseDropdown);
	}, []);

	const handleCheckViewed = async () => {
		if (user && pickedPartner !== null) {
			try {
				setIsFetching(true);

				const response = await triggerRead().unwrap();

				const { duets } = response;

				const currentDuet = getDuetByUserIds(duets, user.id, pickedPartner);

				if (currentDuet) {
					let newDuet: IDuet | null = null;

					if (listType === "queue") {
						newDuet = {
							...currentDuet,
							watched: [...currentDuet.watched, { filmId: props.clickedFilm.id, owner: props.clickedFilm.owner }],
							items: currentDuet.items.filter((film) => film.filmId !== props.clickedFilm.id),
						};
					} else {
						newDuet = {
							...currentDuet,
							watched: currentDuet.watched.filter((film) => film.filmId !== props.clickedFilm.id),
							items: [...currentDuet.items, { filmId: props.clickedFilm.id, owner: props.clickedFilm.owner }],
						};
					}

					const newDuets = duets.map((duet) => (duet.id === currentDuet.id ? newDuet : duet));

					await updateData({ ...response, duets: newDuets });

					setIsFetching(false);
					onClose();
				}
			} catch (error) {
				console.error("Ошибка при измении статуса фильма", error);
			}
		}
	};

	return (
		<StyledContextMenu ref={containerRef} {...props}>
			<StyledContextMenuItem onClick={handleCheckViewed} gap={8} alignItems="center">
				<EyeIcon />
				<span>{listType === "queue" ? "Просмотрено" : "В очередь"}</span>
			</StyledContextMenuItem>
		</StyledContextMenu>
	);
};

const StyledContextMenu = styled(m.div).withConfig({ shouldForwardProp })<Pick<ContextMenuProps, "x" | "y">>`
	position: fixed;
	left: ${(props) => props.x}px;
	top: ${(props) => props.y}px;
	z-index: 14;
	padding: 8px 4px;
	border-radius: 12px;
	border: 1px solid #303030;
	background-color: var(--gray);
`;

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

interface ItemProps extends IFilm {
	isClicked?: boolean;
	onContextMenu?: (film: IFilm, position: Pick<ContextMenuProps, "x" | "y">) => void;
}

const Item: FC<ItemProps> = ({ isClicked, id, name, owner, onContextMenu }) => {
	const { users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === owner);

	const handleRightClick = (event: React.MouseEvent) => {
		event.preventDefault();

		if (onContextMenu) {
			onContextMenu(
				{ id, name, owner },
				{ x: event.clientX + 160 > window.innerWidth ? event.clientX - 160 : event.clientX, y: event.clientY }
			);
		}
	};

	return (
		user && (
			<StyledItem
				isClicked={isClicked}
				onContextMenu={handleRightClick}
				justifyContent="space-between"
				gap={12}
				alignItems="center"
			>
				<span>{name}</span>
				<Avatar size="small" colorId={user.color} symbol={user.name.charAt(0)} />
			</StyledItem>
		)
	);
};

const StyledItem = styled(Flex).withConfig({ shouldForwardProp: (prop) => !["isClicked"].includes(prop) })<{
	isClicked?: boolean;
}>`
	background-color: var(--black);
	padding: 2px 2px 2px 16px;
	border-radius: 22px;
	font-size: 16px;
	font-weight: 600;
	color: white;
	cursor: pointer;
	transition: 200ms;

	${(props) =>
		props.isClicked &&
		css`
			position: relative;
			z-index: 14;
		`}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 0.65;
		}
	}

	span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;
