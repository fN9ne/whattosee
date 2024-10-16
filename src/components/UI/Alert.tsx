import { FC } from "react";
import styled, { css } from "styled-components";
import Flex from "../Flex";

import WarningIcon from "@icons/warning.svg?react";
import CheckIcon from "@icons/check.svg?react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { alertState } from "@/redux/slices/alert";
import { useActions } from "@/hooks/useActions";

const alertTypes = {
	success: css`
		border-color: var(--correct);
		color: var(--correct);
		box-shadow: 1px 1px 15px 5px rgba(29, 222, 64, 0.05);
		svg.stroke path {
			stroke: var(--correct);
		}
		svg:not(.stroke) path {
			fill: var(--correct);
		}
	`,
	error: css`
		border-color: var(--error);
		color: var(--error);
		box-shadow: 1px 1px 15px 5px rgba(226, 55, 55, 0.05);
		svg.stroke path {
			stroke: var(--error);
		}
		svg:not(.stroke) path {
			fill: var(--error);
		}
	`,
};

const StyledAlert = styled(Flex).withConfig({ shouldForwardProp: (prop) => !["type", "visible"].includes(prop) })<
	Pick<alertState, "type" | "visible">
>`
	max-width: 240px;
	padding: 19px 15px;
	border-radius: 12px;
	border: 2px solid transparent;
	background-color: var(--black);
	opacity: 0;
	visibility: hidden;
	translate: -50% -30px;
	position: absolute;
	z-index: 10;
	font-size: 14px;
	line-height: 1.25;
	font-weight: 400;
	cursor: pointer;
	top: 20px;
	left: 50%;
	transition: 250ms;

	svg {
		flex: 0 0 20px;
		height: 20px;
	}

	${({ visible }) =>
		visible &&
		css`
			opacity: 1;
			visibility: visible;
			translate: -50% 0px;
		`}

	${({ type }) => alertTypes[type as keyof typeof alertTypes]};

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			opacity: 0.8;
		}
	}
`;

const Alert: FC = () => {
	const { type, message, visible } = useAppSelector((state) => state.alert);
	const { setAlertVisibility } = useActions();

	return (
		<StyledAlert alignItems="center" onClick={() => setAlertVisibility(false)} type={type} visible={visible} gap={12}>
			{type !== "common" && (type === "error" ? <WarningIcon /> : <CheckIcon />)}
			<Flex column gap={4}>
				{Array.isArray(message) ? message.map((row, index) => <p key={index}>{row}</p>) : message}
			</Flex>
		</StyledAlert>
	);
};

export default Alert;
