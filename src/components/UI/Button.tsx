import React, { FC } from "react";
import styled, { css } from "styled-components";
import Flex from "../Flex";
import { useNavigate } from "react-router-dom";

/* main */

interface ButtonProps {
	icon?: FC;
	fill?: boolean;
	onClick?: () => void;
	to?: string;
	style?: "primary" | "secondary";
	disabled?: boolean;
	slide?: {
		element: React.ReactNode;
		position?: "left" | "right";
	};
	children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({ icon, children, style = "primary", slide, onClick, to, ...props }) => {
	const navigate = useNavigate();

	if (onClick && to) throw new Error('Properties "onClick" and "to" can not be used together.');

	const handleClick = () => {
		if (onClick) onClick();
		if (to) navigate(to);
	};

	return (
		<StyledButton
			onClick={handleClick}
			gap={slide ? 28 : 8}
			justifyContent="center"
			alignItems="center"
			reverse={slide && slide.position === "left"}
			slide={slide}
			style={style}
			{...props}
		>
			{icon && React.createElement(icon)}
			<span>{children}</span>
			{slide && slide.element}
		</StyledButton>
	);
};

export default Button;

/* components */

type StyledButtonProps = Pick<ButtonProps, "style" | "fill" | "slide" | "disabled">;

const shouldForwardProp = (prop: string) => !["style", "fill", "slide", "disabled"].includes(prop);

const StyledButton = styled(Flex).attrs({ as: "button" }).withConfig({ shouldForwardProp })<StyledButtonProps>`
	width: ${(props) => (props.fill ? "100%" : "auto")};
	flex: ${(props) => (props.fill ? "1 1 auto" : "0 1 auto")};
	padding: ${(props) => (props.slide ? (props.slide.position === "left" ? "8px 40px 8px 8px" : "8px 8px 8px 40px") : "0 40px")};
	height: 80px;
	border-radius: 40px;
	font-size: ${(props) => (props.slide ? "18px" : "20px")};
	font-weight: ${(props) => (props.slide ? "400" : "700")};
	color: white;
	background-color: ${(props) => (props.style === "primary" ? "var(--primary)" : "var(--black)")};
	transition: 200ms;

	svg path {
		fill: white;
	}
	
	${(props) =>
		props.disabled &&
		css`
			pointer-events: none;
			opacity: 0.25;
		`}
	
	@media (hover: hover) and (pointer: fine) {
		&:hover {
			background-color: ${(props) => (props.style === "primary" ? "var(--primary-dark)" : "#101010")};
		}
	}

	&:active {
		background-color: ${(props) => (props.style === "primary" ? "var(--primary-darker)" : "#000")};
	}
`;
