import { FC } from "react";
import styled, { css, keyframes } from "styled-components";
import Flex from "../Flex";

import { AnimatePresence as AP, motion as m } from "framer-motion";

/* main */

interface LoaderProps {
	isLoading: boolean;
	absolute?: boolean;
	dark?: boolean;
}

const Loader: FC<LoaderProps> = ({ isLoading, ...props }) => {
	const transitions = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	};

	return (
		<AP mode="wait" initial={false}>
			{isLoading && (
				<Container {...props} {...transitions}>
					<StyledLoader />
				</Container>
			)}
		</AP>
	);
};

export default Loader;

/* components */

type ContainerProps = Pick<LoaderProps, "absolute" | "dark">;

const shouldForwardProp = (prop: string) => !["absolute", "dark"].includes(prop);

const Container = styled(m.div).withConfig({ shouldForwardProp })<ContainerProps>`
	${(props) =>
		props.absolute &&
		css`
			z-index: 20;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			${props.dark &&
			css`
				background-color: rgba(0, 0, 0, 0.25);
				backdrop-filter: blur(2px);
			`}
		`}
`;

const rotateAnimation = keyframes`
	to {
		rotate: 360deg;
	}
`;

const StyledLoader = styled(Flex)`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 5px solid white;
	border-right-color: transparent;
	animation: ${rotateAnimation} 1s infinite linear;
`;
