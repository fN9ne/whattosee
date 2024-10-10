import { FC } from "react";
import styled from "styled-components";
import Flex from "../Flex";
import { Description, H2 } from "./Typographic";

import ArrowLeftIcon from "@icons/arrowLeft.svg?react";
import { useNavigate } from "react-router-dom";

/* main */

interface DialogProps {
	title: string;
	description?: string;
	showBackLink?: boolean;
	children: React.ReactNode;
}

const Dialog: FC<DialogProps> = ({ title, description, showBackLink, children }) => {
	const navigate = useNavigate();

	return (
		<DialogWrapper alignItems="start" column gap={20}>
			{showBackLink && (
				<BackLink onClick={() => navigate(-1)} gap={12} alignItems="center">
					<ArrowLeftIcon />
					<span>Назад</span>
				</BackLink>
			)}
			<StyledDialog column gap={32}>
				<Flex column gap={16}>
					<H2>{title}</H2>
					{description && <Description>{description}</Description>}
				</Flex>
				{children}
			</StyledDialog>
		</DialogWrapper>
	);
};

export default Dialog;

/* components */

const BackLink = styled(Flex).attrs({ as: "button" })`
	color: #a8a8a8;
	background-color: transparent;
	font-size: 20px;
	transition: 200ms;

	svg path {
		fill: #a8a8a8;
	}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 0.7;
		}
	}

	&:active {
		opacity: 0.35;
	}
`;

const DialogWrapper = styled(Flex)`
	max-width: 345px;
	width: 100%;
`;

const StyledDialog = styled(Flex)`
	width: inherit;
	background-color: var(--gray);
	padding: 32px;
	border-radius: 32px;
	position: relative;
	overflow: hidden;
`;
