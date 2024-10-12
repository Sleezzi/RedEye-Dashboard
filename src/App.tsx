import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Notify from "./components/Notify";

import NotFound from "./pages/404";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Guild from "./pages/Guild";

import GuildIndexComponent from "./components/pages/Index";
import ModerationComponent from "./components/pages/Moderation";
import CommandsComponent from "./components/pages/Commands";
import LevelsComponent from "./components/pages/Levels";
import JoinComponent from "./components/pages/Join";
import LeaveComponent from "./components/pages/Leave";
import AutorolesComponent from "./components/pages/Autoroles";
import AutonickComponent from "./components/pages/Autonick";
import LogComponent from "./components/pages/Log";
import TicketsComponent from "./components/pages/Tickets";

import "./cdn/css/main.css";
import { Auth, Notify as NotifyInterface } from "./interfacies";

function App() {
	const location = useLocation();
	useEffect(() => {
		if (location.pathname.split("/").pop()?.length as number > 0) {
			if (document.querySelector("body > #root > #ERROR_404")) {
				document.title = `Redeye - Unable to find the requested page`;
			} else {
				const Text = location.pathname.split("/").pop()?.replace(/-/g, " ");
				document.title = `RedEye - ${Text?.toUpperCase()[0]}${Text?.slice(1, Text.length)}`;
			}
		} else {
			document.title = `RedEye`;
		}
	}, [location.pathname]);
	const [auth, setAuth] = useState<Auth | undefined>(typeof localStorage.getItem("auth") === "string" && localStorage.getItem("auth") !== "" ? JSON.parse(localStorage.getItem("auth") as string) : undefined);
	const [notifications, setNotifications] = useState<{[id: string]: {title: string, message: string, duration: number}}>({});
	
	useEffect(() => {
		if (!auth) return;
		localStorage.setItem("auth", JSON.stringify(auth));
	}, [auth]);
	
	if (!auth || !auth?.token || auth.expireAt <= Math.floor(Date.now() / 1000)) return (<Login />);
	
	const notify: NotifyInterface = (title, message, duration) => {
		if (!title || !message || !duration) return;
		const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
		let id = "";
		for (let index = 0; index < 5; index++) {
			id += chars[Math.floor(Math.random() * chars.length)];
		}
		setNotifications({...notifications, [id]: {title, message, duration: duration || 5}});
	}
	
	return (<>
		<Routes>
			<Route path="" element={<Index auth={auth} notify={notify} />}/>
			<Route path="guild/:guildId"  element={<Guild auth={auth} notify={notify} />}>
				<Route path="" element={<GuildIndexComponent auth={auth} notify={notify} />}/>
				<Route path="moderation" element={<ModerationComponent auth={auth} notify={notify} />}/>
				<Route path="commands" element={<CommandsComponent auth={auth} notify={notify} />}/>
				<Route path="levels" element={<LevelsComponent auth={auth} notify={notify} />}/>
				<Route path="join"  element={<JoinComponent auth={auth} notify={notify} />} />
				<Route path="leave"  element={<LeaveComponent auth={auth} notify={notify} />} />
				<Route path="autorole" element={<AutorolesComponent auth={auth} notify={notify} />}/>
				<Route path="autonick" element={<AutonickComponent auth={auth} notify={notify} />}/>
				<Route path="log" element={<LogComponent auth={auth} notify={notify} />}/>
				<Route path="tickets" element={<TicketsComponent auth={auth} notify={notify} />}/>
			</Route>
			<Route path="*" element={<NotFound />}/>
		</Routes>
		<Notify notifications={notifications} setNotifications={setNotifications} />
	</>);
}

export default App;