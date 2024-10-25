import styled from "styled-components";
import Flex from "./Flex";

const Track = styled(Flex)`
	overflow: auto;
	max-height: 300px;
	padding: 0 10px 0 0;

	@media (hover: hover) and (pointer: fine) {
		&::-webkit-scrollbar {
			width: 5px;

			&-thumb {
				background-color: #535353;

				&:hover {
					background-color: #777;
				}

				&:active {
					background-color: #676767;
				}
			}
		}
	}
`;

export default Track;
