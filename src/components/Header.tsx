import { FC } from "react";
import styled from "styled-components";
import Flex from "./Flex";

import Logo from "@/assets/logo.svg?react";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/types";
import { useAppSelector } from "@/hooks/useAppSelector";

import { AnimatePresence as AP, motion as m } from "framer-motion";
import Profile from "./Profile";

/* main */

const Header: FC = () => {
	const { isHeaderVisible } = useAppSelector((state) => state.global);

	const transitions = {
		initial: { opacity: 0, y: -12 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -12 },
		transition: { duration: 0.15 },
	};

	return (
		<AP mode="wait" initial={false}>
			{isHeaderVisible && (
				<m.div {...transitions}>
					<StyledHeader alignItems="center" justifyContent="space-between">
						<Link to={AppRoutes.Home}>
							<Logo />
						</Link>
						<Profile />
					</StyledHeader>
				</m.div>
			)}
		</AP>
	);
};

export default Header;

/* components */

const StyledHeader = styled(Flex).attrs({ as: "header" })`
	background-color: var(--gray);
	border-radius: 12px;
	padding: 16px 20px;
	margin: 20px 15px 0 15px;
	position: relative;
	z-index: 1;

	> a > svg {
		width: 50px;
		height: 50px;
	}
`;
