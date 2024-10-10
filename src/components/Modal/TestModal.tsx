import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";

import ModalWrapper from "./ModalWrapper";
import styled from "styled-components";

const ModalContent = styled.div`
	max-width: 520px;
	width: 100%;
	padding: 20px;
	background-color: var(--0);
`;

const TestModal: FC = () => {
	const { test } = useAppSelector((state) => state.modal);

	return (
		<ModalWrapper isActive={test} name="test">
			<ModalContent>
				<h1>Test</h1>
			</ModalContent>
		</ModalWrapper>
	);
};

export default TestModal;
