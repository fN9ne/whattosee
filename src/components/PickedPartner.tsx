import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import Flex from "./Flex";
import { useAppSelector } from "@/hooks/useAppSelector";
import Loader from "./UI/Loader";
import Avatar from "./UI/Avatar";
import { IUser } from "@/services/api";

interface PickedPartnerProps {
	userId: number | null;
}

const PickedPartner: FC<PickedPartnerProps> = ({ userId }) => {
	const { users } = useAppSelector((state) => state.data);

	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		setUser(users.find((user) => user.id === userId) || null);
	}, [userId, users]);

	return (
		<Flex column gap={8}>
			<Label>Выбранный участник дуэта:</Label>
			<User alignItems="center" gap={16}>
				{!user ? (
					<Loader isLoading={!user} absolute />
				) : (
					<>
						<Avatar colorId={user.color} symbol={user.name.charAt(0)} />
						<span>{user.name}</span>
					</>
				)}
			</User>
		</Flex>
	);
};

export default PickedPartner;

/* components */

const User = styled(Flex)`
	padding: 8px 24px 8px 8px;
	background-color: var(--black);
	border-radius: 40px;
	font-weight: 700;
	font-size: 18px;
	color: white;
	min-height: 66px;
	position: relative;

	span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

const Label = styled.div`
	font-size: 16px;
	font-weight: 300;
	line-height: 1.5;
	color: rgba(255, 255, 255, 0.6);
`;
