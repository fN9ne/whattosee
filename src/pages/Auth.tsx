import Button from "@/components/UI/Button";
import Dialog from "@/components/UI/Dialog";
import { FC } from "react";

import LoginIcon from "@icons/login.svg?react";
import PersonAddIcon from "@icons/personAdd.svg?react";
import Flex from "@/components/Flex";
import { AppRoutes } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Auth: FC = () => {
	useDocumentTitle("Авторизация");

	return (
		<Dialog title="Авторизация" showBackLink description="Войдите или создайте аккаунт в несколько кликов!">
			<Flex column gap={8}>
				<Button to={AppRoutes.Login} icon={LoginIcon}>
					Войти
				</Button>
				<Button to={AppRoutes.CreateAccount} style="secondary" icon={PersonAddIcon}>
					Создать аккаунт
				</Button>
			</Flex>
		</Dialog>
	);
};

export default Auth;
