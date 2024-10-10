import styled from "styled-components";

interface FlexProps {
	column?: boolean;
	reverse?: boolean;
	wrap?: boolean;
	gap?: number | [number, number];
	alignItems?: "center" | "start" | "end" | "baseline";
	justifyContent?: "center" | "start" | "end" | "space-between";
	itemsPerRow?: number;
	margin?: number | [number, number?, number?, number?];
	padding?: number | [number, number?, number?, number?];
	bgColor?: string;
	bgColorV?: string;
	children?: React.ReactNode;
}

const shouldForwardProp = (prop: string) =>
	![
		"column",
		"reverse",
		"wrap",
		"gap",
		"alignItems",
		"justifyContent",
		"itemsPerRow",
		"margin",
		"padding",
		"bgColor",
		"bgColorV",
	].includes(prop);

const getFlexDirection = (isColumn?: boolean, isReverse?: boolean) => {
	return `${isColumn ? "column" : "row"}${isReverse ? "-reverse" : ""}`;
};

const getChildSize = (itemsInRow: number, gap: number) => {
	return `calc(100%/${itemsInRow} - (${gap}px - ${gap}px/${itemsInRow}))`;
};

const Flex = styled.div.withConfig({ shouldForwardProp })<FlexProps>`
	display: flex;
	${({ column, reverse }) => (column || reverse) && `flex-direction: ${getFlexDirection(column, reverse)}`};
	${({ wrap }) => wrap && "flex-wrap: wrap"};
	${({ gap }) => gap && (!Array.isArray(gap) ? `gap: ${gap}px` : `column-gap: ${gap[0]}px; row-gap: ${gap[1]}px`)};
	${({ alignItems }) => alignItems && `align-items: ${alignItems}`};
	${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent}`};
	${({ margin }) => margin && `margin: ${!Array.isArray(margin) ? margin : margin.join("px ")}px`};
	${({ padding }) => padding && `padding: ${!Array.isArray(padding) ? padding : padding.join("px ")}px`};
	${({ bgColor }) => bgColor && `background: ${bgColor}`};
	${({ bgColorV }) => bgColorV && `background: var(--${bgColorV})`};
	${({ itemsPerRow, gap }) =>
		itemsPerRow &&
		`
		& > * {
			flex: 1 1 ${getChildSize(itemsPerRow, gap ? (Array.isArray(gap) ? gap[0] : gap) : 0)};
		}
	`}
`;

export default Flex;
