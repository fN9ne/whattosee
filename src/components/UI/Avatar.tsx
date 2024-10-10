import { FC } from "react";
import styled, { css } from "styled-components";
import Flex from "../Flex";

/* main */

interface AvatarProps {
	colorId: number;
	symbol: string;
	square?: boolean;
	responsive?: boolean;
	picked?: boolean;
	setPicked?: () => void;
	onClick?: () => void;
	size?: "small" | "normal" | "large";
}

const Avatar: FC<AvatarProps> = ({ symbol, ...props }) => {
	const handlePick = () => {
		if (props.onClick) return props.onClick();
		if (props.setPicked) props.setPicked();
	};

	return (
		<StyledAvatar picked={props.picked} onClick={handlePick} {...props} alignItems="center" justifyContent="center">
			{symbol.toUpperCase()}
		</StyledAvatar>
	);
};

export default Avatar;

/* components */

const avatarSizes = {
	small: css`
		width: 40px;
		height: 40px;
		flex: 0 0 40px;
		font-size: 19px;
	`,
	normal: css`
		width: 50px;
		height: 50px;
		flex: 0 0 50px;
		font-size: 24px;
	`,
	large: css`
		width: 64px;
		height: 64px;
		flex: 0 0 64px;
		font-size: 29px;
	`,
};

const avatarColors = {
	"1": "#E95555",
	"2": "#E99555",
	"3": "#E9D355",
	"4": "#64E955",
	"5": "#55E9C7",
	"6": "#5569E9",
	"7": "#9F55E9",
	"8": "#E755E9",
};

type StyledAvatarProps = Pick<AvatarProps, "colorId" | "size" | "responsive" | "picked" | "setPicked" | "square">;

const shouldForwardProp = (prop: string) => !["colorId", "size", "responsive", "picked", "setPicked", "square"].includes(prop);

const StyledAvatar = styled(Flex).withConfig({ shouldForwardProp })<StyledAvatarProps>`
	border-radius: ${(props) => (props.square ? "12px" : "50%")};
	aspect-ratio: 1 / 1;
	position: relative;
	z-index: 2;
	color: #333;
	font-weight: 900;
	transition: 200ms;

	${(props) =>
		props.picked !== undefined &&
		(props.picked
			? css`
					opacity: 1;
			  `
			: css`
					opacity: 0.25;
			  `)}
	${(props) => (props.responsive ? "font-size: 24px" : avatarSizes[props.size || ("normal" as keyof typeof avatarSizes)])};
	background-color: ${(props) => avatarColors[`${props.colorId}` as keyof typeof avatarColors]};
`;
