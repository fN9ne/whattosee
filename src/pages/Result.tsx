import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { AppRoutes } from "@/types";
import { FC } from "react";

import HomeIcon from "@icons/home.svg?react";
import { IFilm } from "@/services/api";
import { useAppSelector } from "@/hooks/useAppSelector";
import styled from "styled-components";
import Flex from "@/components/Flex";
import Avatar from "@/components/UI/Avatar";

const Result: FC = () => {
	const { result } = useAppSelector((state) => state.global);

	return (
		<Dialog title="Приятного просмотра!" description="Колесо фортуны выбрало для вас:">
			<Flex column gap={12}>
				{result !== null && <Item {...result} />}
				<Button icon={HomeIcon} to={AppRoutes.Home}>
					На главную
				</Button>
			</Flex>
		</Dialog>
	);
};

export default Result;

/* components */

const Item: FC<IFilm> = ({ name, owner }) => {
	const { users } = useAppSelector((state) => state.data);

	const user = users.find((user) => user.id === owner);

	return (
		user && (
			<StyledItem alignItems="center" gap={20}>
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
