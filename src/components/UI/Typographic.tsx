import styled from "styled-components";

const Heading = styled.div`
	color: white;
	font-family: "Fira Sans Condensed", sans-serif;
	line-height: 1.1;
	font-weight: 500;
`;

export const H2 = styled(Heading).attrs({ as: "h2" })`
	font-size: 28px;
`;

export const H3 = styled(Heading).attrs({ as: "h3" })`
	font-size: 20px;
`;

export const Description = styled.div`
	font-weight: 300;
	font-size: 16px;
	line-height: 1.5;
	color: rgba(255, 255, 255, 0.6);
`;
