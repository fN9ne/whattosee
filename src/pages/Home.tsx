import Flex from "@/components/Flex";
import { FC } from "react";
import styled from "styled-components";

import ScheduleIcon from "@icons/schedule.svg?react";
import VisibilityIcon from "@icons/visibility.svg?react";
import GroupIcon from "@icons/group.svg?react";
import { useAppSelector } from "@/hooks/useAppSelector";
import Loader from "@/components/UI/Loader";
import Avatar from "@/components/UI/Avatar";
import { IUserLatestFilm } from "@/services/api";
import Button from "@/components/UI/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AppRoutes } from "@/types";

const Home: FC = () => {
	useDocumentTitle("Главная");

	const { user } = useAppSelector((state) => state.user);
	const { users } = useAppSelector((state) => state.data);

	return users && user ? (
		<Content gap={20} column>
			{user.latest.duets.length > 0 && (
				<Flex column gap={8}>
					<CategoryName gap={8}>
						<ScheduleIcon />
						<span>Недавние дуэты</span>
					</CategoryName>
					<DuetsTrack gap={8}>
						{user.latest.duets.map((id, index) => (
							<UserItem key={index} userId={id} />
						))}
					</DuetsTrack>
				</Flex>
			)}
			{user.latest.films.length > 0 && (
				<Flex column gap={8}>
					<CategoryName gap={8}>
						<VisibilityIcon />
						<span>Недавние просмотры</span>
					</CategoryName>
					<Flex gap={4} column>
						{user.latest.films.map((film, index) => (
							<Film key={index} {...film} />
						))}
					</Flex>
				</Flex>
			)}
			<Footer column justifyContent={user.latest.films.length === 0 && user.latest.duets.length === 0 ? "center" : "end"}>
				<Button to={AppRoutes.PickPartner} icon={GroupIcon}>
					Выбрать дуэт
				</Button>
			</Footer>
		</Content>
	) : (
		<Loader isLoading={!user || !users} absolute />
	);
};

export default Home;

/* components */

interface UserItemProps {
	userId: number;
}

const UserItem: FC<UserItemProps> = ({ userId }) => {
	const { users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === userId);

	return (
		user && (
			<StyledUserItem gap={12} alignItems="center">
				<Avatar colorId={user.color} symbol={user.name.charAt(0)} />
				<span>{user.name}</span>
			</StyledUserItem>
		)
	);
};

const Film: FC<IUserLatestFilm> = ({ filmId, owner }) => {
	const { items, users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === owner);
	const film = items.find((film) => film.id === filmId);

	return (
		user &&
		film && (
			<StyledFilm alignItems="center" justifyContent="space-between" gap={12}>
				<span>{film.name}</span>
				<Avatar colorId={user.color} symbol={user.name.charAt(0)} />
			</StyledFilm>
		)
	);
};

/* style components */

const Footer = styled(Flex)`
	flex: 1 1 auto;
`;

const DuetsTrack = styled(Flex)`
	overflow: hidden;
`;

const Content = styled(Flex)`
	width: 100%;
	flex: 1 1 auto;
`;

const StyledUserItem = styled(Flex)`
	background-color: var(--gray);
	border-radius: 40px;
	padding: 8px 20px 8px 8px;
	font-size: 16px;
	font-weight: 700;
	color: white;
	overflow: hidden;
	cursor: pointer;
	transition: 200ms;

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 0.75;
		}
	}

	&:active {
		opacity: 0.5;
	}

	span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

const StyledFilm = styled(StyledUserItem)`
	padding: 8px 8px 8px 24px;
	font-size: 18px;
	cursor: auto;

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 1;
		}
	}

	&:active {
		opacity: 1;
	}
`;

const CategoryName = styled(Flex)`
	font-size: 16px;
	color: rgba(255, 255, 255, 0.5);

	svg {
		width: 1em;
		height: 1em;

		path {
			fill: rgba(255, 255, 255, 0.5);
		}
	}
`;
