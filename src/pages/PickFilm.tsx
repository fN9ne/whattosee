import Flex from "@/components/Flex";
import PickedPartner from "@/components/PickedPartner";
import Avatar from "@/components/UI/Avatar";
import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { Description } from "@/components/UI/Typographic";
import { useAppSelector } from "@/hooks/useAppSelector";
import { IDuet, IFilm, useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { FC, useEffect, useState } from "react";
import styled, { css } from "styled-components";

import SlideArrowLeft from "@/assets/slideArrowLeft.svg?react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import CheckIcon from "@icons/check.svg?react";
import AddIcon from "@icons/add.svg?react";
import Loader from "@/components/UI/Loader";

const PickFilm: FC = () => {
	useDocumentTitle("Добавить фильмы из списка");

	const { pickedPartner } = useAppSelector((state) => state.global);
	const { users, duets, items } = useAppSelector((state) => state.data);
	const { user } = useAppSelector((state) => state.user);

	const [filmList, setFilmList] = useState<IFilm[]>([]);
	const [pickedFilms, setPickedFilms] = useState<IFilm[]>([]);
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const navigate = useNavigate();

	const [triggerRead, { isLoading: readLoading }] = useLazyReadQuery();
	const [updateData, { isLoading: updateLoading }] = useUpdateMutation();

	const partner = users.find((user) => user.id === pickedPartner);

	const handleTogglePickingFilm = (item: IFilm) => {
		if (pickedFilms.includes(item)) {
			setPickedFilms((state) => state.filter((film) => film !== item));
		} else {
			setPickedFilms((state) => [...state, item]);
		}
	};

	const handleAddPickedFilms = async () => {
		if (user && pickedPartner !== null) {
			const currentDuet = duets.find(
				(duet) =>
					(duet.firstUser === user.id && duet.secondUser === pickedPartner) ||
					(duet.firstUser === pickedPartner && duet.secondUser === user.id)
			);

			if (currentDuet) {
				setIsFetching(true);

				const response = await triggerRead().unwrap();

				const newDuet: IDuet = {
					...currentDuet,
					items: [...currentDuet.items, ...pickedFilms.map((film) => ({ filmId: film.id, owner: user.id }))],
				};

				const newDuets = response.duets.map((duet) => (duet.id === currentDuet.id ? newDuet : duet));

				await updateData({ ...response, duets: newDuets });
			}
		}
	};

	useEffect(() => {
		if (user && pickedPartner !== null && duets.length > 0) {
			const currentDuet = duets.find(
				(duet) =>
					(duet.firstUser === pickedPartner && duet.secondUser === user.id) ||
					(duet.firstUser === user.id && duet.secondUser === pickedPartner)
			);

			if (currentDuet) {
				const newItems = items.filter(
					(item) =>
						!currentDuet.items.map((duetItem) => duetItem.filmId).includes(item.id) &&
						!currentDuet.watched.map((duetItem) => duetItem.filmId).includes(item.id)
				);

				setFilmList(newItems);
			}
		}
	}, [duets, items, pickedPartner, user]);

	useEffect(() => {
		setIsFetching(readLoading || updateLoading);
	}, [readLoading, updateLoading]);

	return (
		<Dialog showBackLink title="Выбрать фильм">
			<Loader dark absolute isLoading={isFetching} />
			<Flex column gap={20}>
				<PickedPartner userId={pickedPartner} />
				{filmList.length > 0 ? (
					<Track column gap={4}>
						{filmList.map((item, index) => (
							<Item onClick={() => handleTogglePickingFilm(item)} picked={pickedFilms.includes(item)} {...item} key={index} />
						))}
					</Track>
				) : (
					<Flex column gap={12} alignItems="start">
						{partner && (
							<Description>Пока что в базе отсутствуют фильмы, которых у вас нет в дуэте с "{partner.name}"...</Description>
						)}
						<Button onClick={() => navigate(-1)} style="secondary" slide={{ element: <SlideArrowLeft />, position: "left" }}>
							Назад
						</Button>
					</Flex>
				)}
			</Flex>
			{filmList.length > 0 && (
				<Button disabled={pickedFilms.length === 0} icon={AddIcon} onClick={handleAddPickedFilms}>
					Добавить
				</Button>
			)}
		</Dialog>
	);
};

export default PickFilm;

/* components */

const Track = styled(Flex)`
	padding: 2px 10px 0 0;
	max-height: 350px;
	overflow: auto;

	&::-webkit-scrollbar {
		width: 5px;

		&-thumb {
			background-color: #777;
		}
	}
`;

interface ItemProps extends IFilm {
	picked: boolean;
	onClick: () => void;
}

const Item: FC<ItemProps> = ({ name, owner, onClick, picked }) => {
	const { users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === owner);

	return (
		user && (
			<StyledItem picked={picked} onClick={onClick} alignItems="center" justifyContent="space-between" gap={12}>
				<span>{name}</span>
				<Avatar size="small" colorId={user.color} symbol={user.name.charAt(0)} />
				<i>
					<CheckIcon />
				</i>
			</StyledItem>
		)
	);
};

interface StyledItemProps {
	picked: boolean;
}

const shouldForwardProp = (prop: string) => !["picked"].includes(prop);

const StyledItem = styled(Flex).withConfig({ shouldForwardProp })<StyledItemProps>`
	border-radius: 22px;
	padding: 2px 2px 2px 16px;
	font-size: 16px;
	font-weight: 600;
	transition: 200ms;
	cursor: pointer;
	position: relative;
	background-color: rgba(22, 22, 22, 0.25);
	color: rgba(255, 255, 255, 0.25);

	span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	> div {
		opacity: 0.25;
		transition: 200ms;
	}

	i {
		top: -2px;
		right: 0;
		position: absolute;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #64e955;
		border-radius: 50%;
		z-index: 2;
		opacity: 0;
		visibility: hidden;
		scale: 0.25;
		transition: 250ms ease-out;

		${(props) =>
			props.picked &&
			css`
				opacity: 1;
				visibility: visible;
				scale: 1;
			`}

		svg {
			width: 12px;
			height: 12px;

			path {
				fill: white;
			}
		}
	}

	${(props) =>
		props.picked &&
		css`
			background-color: var(--black);
			color: white;
			> div {
				opacity: 1;
			}
		`}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			background-color: rgba(22, 22, 22, 0.6);
			color: rgba(255, 255, 255, 0.6);
			> div {
				opacity: 0.6;
			}
		}
	}

	&:active {
		background-color: var(--black);
		color: white;
		> div {
			opacity: 1;
		}
	}
`;
