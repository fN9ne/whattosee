import { FC } from "react";
import { motion as m } from "framer-motion";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledLayout = styled(m.div)`
	padding: 20px 15px;
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	gap: 20px;
`;

const MainLayout: FC = () => {
	const transitions = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
		transition: { duration: 0.25 },
	};

	return (
		<StyledLayout {...transitions}>
			<Outlet />
		</StyledLayout>
	);
};

export default MainLayout;
