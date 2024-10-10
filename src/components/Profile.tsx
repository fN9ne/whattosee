import React, { FC, useState } from "react";
import Avatar from "./UI/Avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import Loader from "./UI/Loader";
import styled, { css } from "styled-components";
import Flex from "./Flex";
import { AnimatePresence as AP, motion as m } from "framer-motion";

import PersonIcon from "@icons/person.svg?react";
import LogoutIcon from "@icons/logout.svg?react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/types";
import { useActions } from "@/hooks/useActions";

const Profile: FC = () => {
	const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);

	const { setUser, setUserId } = useActions();
	const { user } = useAppSelector((state) => state.user);

	const transitions = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const transitions2 = {
		initial: { opacity: 0, y: -8 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -8 },
	};

	interface IDropdownItem {
		icon: FC;
		name: string;
		style?: DropdownItemProps["style"];
		onClick?: () => void;
		to?: string;
	}

	const dropdownItems: IDropdownItem[] = [
		{
			icon: PersonIcon,
			name: "Профиль",
			to: AppRoutes.Profile,
		},
		{
			icon: LogoutIcon,
			style: "red",
			name: "Выйти",
			onClick: () => handleLogout(),
		},
	];

	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("userId");
		setUser(null);
		setUserId(null);
	};

	return user ? (
		<StyledProfile>
			<Avatar
				square={isDropDownActive}
				onClick={() => setIsDropDownActive((state) => !state)}
				symbol={user.name.charAt(0)}
				colorId={user.color || 1}
			/>
			<AP mode="wait" initial={false}>
				{isDropDownActive && (
					<m.div {...transitions}>
						<DarkArea onClick={() => setIsDropDownActive(false)} />
						<DropdownBody {...transitions2}>
							<Flex column gap={2}>
								{dropdownItems.map((item, index) => (
									<DropdownItem
										style={item.style || "normal"}
										gap={8}
										alignItems="center"
										onClick={() => (item.onClick ? item.onClick() : item.to ? navigate(item.to) : null)}
										key={index}
									>
										{React.createElement(item.icon)}
										<span>{item.name}</span>
									</DropdownItem>
								))}
							</Flex>
						</DropdownBody>
					</m.div>
				)}
			</AP>
		</StyledProfile>
	) : (
		<LoaderContainer>
			<Loader isLoading={user === undefined || user === null} absolute />
		</LoaderContainer>
	);
};

export default Profile;

/* components */

const DropdownBody = styled(m.div)`
	background-color: var(--gray);
	border: 1px solid #303030;
	border-radius: 12px;
	padding: 8px 4px;
	position: absolute;
	top: 100%;
	right: 0;
	translate: 0 4px;
`;

interface DropdownItemProps {
	style?: "normal" | "red";
}

const shouldForwardProp = (prop: string) => !["style"].includes(prop);

const DropdownItem = styled(Flex).attrs({ as: "button" }).withConfig({ shouldForwardProp })<DropdownItemProps>`
	width: 180px;
	border-radius: 8px;
	font-size: 16px;
	padding: 12px;
	background-color: transparent;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	transition: 200ms;

	> svg {
		width: 1em;
		height: 1em;

		path {
			transition: 200ms;
			fill: rgba(255, 255, 255, 0.5);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			${(props) =>
				props.style === "red"
					? css`
							color: var(--error-light);
							background-color: #382d2d;

							svg path {
								fill: var(--error-light);
							}
					  `
					: css`
							color: white;
							background-color: #303030;

							svg path {
								fill: white;
							}
					  `}
		}
	}

	&:active {
		${(props) =>
			props.style === "red"
				? css`
						color: var(--error-light);
						background-color: #382d2d;

						svg path {
							fill: var(--error-light);
						}
				  `
				: css`
						color: white;
						background-color: #303030;

						svg path {
							fill: white;
						}
				  `}
	}
`;

const DarkArea = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(16, 19, 18, 0.8);
`;

const StyledProfile = styled.div`
	position: relative;
`;

const LoaderContainer = styled.div`
	width: 50px;
	height: 50px;
	position: relative;
`;
