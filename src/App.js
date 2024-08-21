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
import AnnoucementsComponent from "./components/pages/Annoucements";
import AutoroleComponent from "./components/pages/Autorole";
import LogComponent from "./components/pages/Log";

import "./cdn/css/main.css";

function App() {
	const location = useLocation();
	useEffect(() => {
		if (location.pathname.split("/").pop().length > 0) {
			if (document.querySelector("body > #root > #ERROR_404")) {
				document.title = `Redeye - Unable to find the requested page`;
			} else {
				const Text = location.pathname.split("/").pop().replaceAll("-", " ");
				document.title = `RedEye - ${Text.toUpperCase()[0]}${Text.slice(1, Text.length)}`;
			}
		} else {
			document.title = `RedEye`;
		}
	}, [location.pathname]);
	const [auth, setAuth] = useState(localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : {
		token: undefined,
		expireAt: 0
	});
	const [notifications, setNotifications] = useState([]);
	
	useEffect(() => {
		localStorage.setItem("auth", JSON.stringify(auth));
	}, [auth]);

	if (!auth.token || auth.expireAt <= Math.floor(Date.now() / 1000)) return (<Login auth={auth} setAuth={setAuth} />);

	const notify = (title, message, duration) => {
		if (!title || !message || !duration) return;
		const newNotifications = [...notifications];
		newNotifications.push({ title, message, duration });
		setNotifications(newNotifications);
	}
	
	return (<>
		<Routes>
			<Route path="" element={<Index auth={auth} />}/>
			<Route path="guild/:guildId"  element={<Guild auth={auth} notify={notify} />}>
				<Route path="" element={<GuildIndexComponent auth={auth} notify={notify} />}/>
				<Route path="moderation" element={<ModerationComponent auth={auth} notify={notify} />}/>
				<Route path="commands" element={<CommandsComponent auth={auth} notify={notify} />}/>
				<Route path="levels" element={<LevelsComponent auth={auth} notify={notify} />}/>
				<Route path="annoucements"  element={<AnnoucementsComponent auth={auth} notify={notify} />} />
				<Route path="autorole" element={<AutoroleComponent auth={auth} notify={notify} />}/>
				<Route path="log" element={<LogComponent auth={auth} notify={notify} />}/>
			</Route>
			<Route path="*" element={<NotFound />}/>
		</Routes>
		<Notify notifications={notifications} setNotifications={setNotifications} />
	</>);
}

export default App;