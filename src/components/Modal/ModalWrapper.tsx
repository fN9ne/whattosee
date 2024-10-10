import { FC, useRef } from "react";
import styled from "styled-components";
import Flex from "../Flex";
import { ModalState } from "@/redux/slices/modal";
import { useActions } from "@/hooks/useActions";

import { AnimatePresence as AP, motion as m } from "framer-motion";

interface ModalWrapperProps {
	isActive: boolean;
	name: keyof ModalState;
	children: React.ReactNode;
}

const StyledModalWrapper = styled(m.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10;
	background-color: rgba(22, 23, 25, 0.75);
	overflow: auto;
	overscroll-behavior: contain;
`;

const ModalBody = styled(Flex)`
	min-height: 100%;
	padding: 20px;
`;

const ModalWrapper: FC<ModalWrapperProps> = ({ isActive, name, children }) => {
	const { closeModal } = useActions();

	const modalBodyRef = useRef<HTMLDivElement>(null);

	const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
		if (modalBodyRef.current && (event.target as Node) === modalBodyRef.current) {
			closeModal(name);
		}
	};

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<AP mode="wait" initial={false}>
			{isActive && (
				<StyledModalWrapper onClick={handleClose} {...transitions}>
					<ModalBody ref={modalBodyRef} alignItems="center" justifyContent="center">
						{children}
					</ModalBody>
				</StyledModalWrapper>
			)}
		</AP>
	);
};

export default ModalWrapper;
