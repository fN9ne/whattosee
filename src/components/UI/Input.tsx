import { FC } from "react";
import styled from "styled-components";

/* main */

interface InputProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}

const Input: FC<InputProps> = ({ placeholder, onChange, value }) => {
	return <StyledInput placeholder={placeholder} type="text" value={value} onChange={(event) => onChange(event.target.value)} />;
};

export default Input;

/* components */

const StyledInput = styled.input`
	width: 100%;
	height: 80px;
	padding: 0 40px;
	border-radius: 40px;
	background-color: var(--black);
	color: white;
	transition: 200ms;
	border: 2px solid transparent;
	font-size: 20px;
	font-weight: 700;

	&::placeholder {
		color: rgba(255, 255, 255, 0.25);
	}

	&:focus {
		border-color: var(--primary);
	}
`;
