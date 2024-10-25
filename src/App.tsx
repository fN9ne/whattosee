import { FC, useEffect } from "react";
import { AnimatePresence as AP } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import styled from "styled-components";
import Flex from "./components/Flex";
import { AppRoutes } from "./types";
import GettingStarted from "./pages/GettingStarted";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import AuthLayout from "./layouts/AuthLayout";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useActions } from "./hooks/useActions";
import { useAppSelector } from "./hooks/useAppSelector";
import { useLazyReadQuery } from "./services/api";
import AppLayout from "./layouts/AppLayout";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import PickPartner from "./pages/PickPartner";
import Lobby from "./pages/Lobby";
import PickLayout from "./layouts/PickLayout";
import AddFilm from "./pages/AddFilm";
import FilmList from "./pages/FilmList";
import PickFilm from "./pages/PickFilm";
import Alert from "./components/UI/Alert";
import Result from "./pages/Result";

const Wrapper = styled(Flex)`
	background-color: var(--black);
	max-width: 375px;
	margin: 0 auto;
	width: 100%;
	min-height: 100vh;
`;

const App: FC = () => {
	const location = useLocation();
	const { setUserId, setUser } = useActions();
	const { userId } = useAppSelector((state) => state.storage);
	const [triggetRead] = useLazyReadQuery();

	useLocalStorage("userId", setUserId);

	useEffect(() => {
		if (userId !== undefined && userId !== null) {
			triggetRead()
				.unwrap()
				.then((response) => {
					const user = response.users.find((user) => user.id === userId);

					if (user) setUser(user);
				});
		} else if (userId === null) setUser(null);
	}, [userId]);

	return (
		<Wrapper column>
			<Header />
			<AP mode="wait" initial={false}>
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<MainLayout />}>
						<Route index element={<Navigate to={AppRoutes.GettingStarted} />} />
						<Route path={AppRoutes.GettingStarted} element={<GettingStarted />} />
						<Route element={<AuthLayout />}>
							<Route path={AppRoutes.Auth} element={<Auth />} />
							<Route path={AppRoutes.Login} element={<Login />} />
							<Route path={AppRoutes.CreateAccount} element={<CreateAccount />} />
						</Route>
						<Route element={<AppLayout />}>
							<Route path={AppRoutes.Home} element={<Home />} />
							<Route path={AppRoutes.Profile} element={<Profile />} />
							<Route path={AppRoutes.PickPartner} element={<PickPartner />} />
							<Route element={<PickLayout />}>
								<Route path={AppRoutes.Lobby} element={<Lobby />} />
								<Route path={AppRoutes.AddFilm} element={<AddFilm />} />
								<Route path={AppRoutes.FilmList} element={<FilmList />} />
								<Route path={AppRoutes.PickFilm} element={<PickFilm />} />
								<Route path={AppRoutes.Result} element={<Result />} />
							</Route>
						</Route>
						<Route path="*" element={<Navigate to={AppRoutes.GettingStarted} />} />
					</Route>
				</Routes>
			</AP>
			<Alert />
		</Wrapper>
	);
};

export default App;
