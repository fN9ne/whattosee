import Dialog from "@/components/UI/Dialog";
import { FC, useEffect } from "react";

import Logo from "@/assets/logo.svg?react";
import Flex from "@/components/Flex";
import { Description } from "@/components/UI/Typographic";
import Button from "@/components/UI/Button";

import SlideArrowRight from "@/assets/slideArrowRight.svg?react";
import { AppRoutes } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useActions } from "@/hooks/useActions";

const GettingStarted: FC = () => {
	useDocumentTitle("Добро пожаловать!");

	const { setHeaderVisibility } = useActions();
	const { user } = useAppSelector((state) => state.user);

	useEffect(() => {
		setHeaderVisibility(false);
	}, []);

	return (
		<Dialog title="Добро пожаловать в">
			<Flex alignItems="start" column gap={40}>
				<Flex column gap={24}>
					<Logo />
					<Description>
						Тут вы можете со своими друзьями разрешить дилемму того, что же вам посмотреть. Всё просто - добавьте интересующие вас
						фильмы/сериалы, а колесо фортуны сделает выбор за вас!
					</Description>
				</Flex>
				<Button to={user !== null ? AppRoutes.Home : AppRoutes.Auth} style="secondary" slide={{ element: <SlideArrowRight /> }}>
					Начать
				</Button>
			</Flex>
		</Dialog>
	);
};

export default GettingStarted;
