import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
	:root {
		/* neutrals */
		--black: #161616;
		--gray: #252525;
		/* primary */
		--primary-lighter: #81eedb;
		--primary-light: #5dd5c1;
		--primary: #42BBA7;
		--primary-dark: #309483;
		--primary-darker: #1f7063;
		/* correct */
		--correct-lighter: #8ae99b;
		--correct-light: #51e16b;
		--correct: #1dde40;
		--correct-dark: #16c836;
		--correct-darker: #0ba627;
		/* error */
		--error-lighter: #ee9696;
		--error-light: #eb6666;
		--error: #e23737;
		--error-dark: #c42626;
		--error-darker: #a92121;
	}
`;

export default GlobalStyles;
