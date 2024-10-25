import { FC } from "react";
import styled, { css } from "styled-components";

interface TabProps {
	isActive: boolean;
	name: string;
	notification?: number;
	onClick: () => void;
}

const Notification = styled.div`
	padding: 2px 4px 0;
	height: 16px;
	border-radius: 3px;
	font-size: 10px;
	font-weight: 500;
	line-height: 14px;
	color: rgba(255, 255, 255, 0.35);
	background-color: var(--black);
	transition: 200ms;
`;

const Text = styled.div`
	font-family: "Fira Sans Condensed", sans-serif;
	font-weight: 400;
	font-size: 16px;
	color: rgba(255, 255, 255, 0.35);
	transition: 200ms;
`;

interface StyledTabProps {
	isActive: boolean;
}

const StyledTab = styled.button.withConfig({ shouldForwardProp: (prop) => !["isActive"].includes(prop) })<StyledTabProps>`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 10px;
	transition: 250ms;

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			${Text} {
				color: rgba(255, 255, 255, 0.75);
			}
		}
	}

	&:active {
		${Text} {
			color: white;
		}
	}

	${({ isActive }) =>
		isActive &&
		css`
			${Text} {
				color: white;
			}

			${Notification} {
				color: white;
			}
		`}
`;

const Tab: FC<TabProps> = ({ isActive, name, notification, onClick }) => {
	return (
		<StyledTab onClick={onClick} isActive={isActive}>
			<Text>{name}</Text>
			{notification !== undefined && <Notification>{notification}</Notification>}
		</StyledTab>
	);
};

export default Tab;
