import Flex from "@/components/Flex";
import Avatar from "@/components/UI/Avatar";
import Dialog from "@/components/UI/Dialog";
import Loader from "@/components/UI/Loader";
import { useActions } from "@/hooks/useActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLazyReadQuery } from "@/services/api";
import { AppRoutes } from "@/types";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PickPartner: FC = () => {
	useDocumentTitle("Выбор дуэта");

	const [triggerRead, { isLoading }] = useLazyReadQuery();
	const { setPickedPartner } = useActions();
	const { users } = useAppSelector((state) => state.data);
	const navigate = useNavigate();

	useEffect(() => {
		triggerRead()
			.unwrap()
			.then((response) => console.log(response));
	}, []);

	const handlePickPartner = (id: number) => {
		setPickedPartner(id);
		navigate(AppRoutes.Lobby);
	};

	return (
		<Dialog showBackLink title="Выбор дуэта" description="Выберите того с кем хотите что-то посмотреть.">
			<Loader isLoading={isLoading} dark absolute />
			<Track column gap={4}>
				{users.map((user, index) => (
					<User onClick={() => handlePickPartner(user.id)} gap={16} alignItems="center" key={index}>
						<Avatar colorId={user.color} symbol={user.name.charAt(0)} />
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
	border: 2px solid transparent;
	transition: 200ms;
	font-weight: 700;
	font-size: 20px;
	color: white;

	span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	&:active {
		border-color: var(--primary);
	}
`;

const Track = styled(Flex)`
	max-height: 400px;
	overflow: auto;
	padding: 0 12px 0 0;
`;
