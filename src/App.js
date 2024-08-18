import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
		const redirect = localStorage.getItem("redirect")
		if (redirect) {
			localStorage.removeItem("redirect");
			window.location.href = redirect;
			window.location.reload();
		}
	}, []);
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
	useEffect(() => {
		localStorage.setItem("auth", JSON.stringify(auth));
	}, [auth]);
	
	if (!auth.token || auth.expireAt <= Math.floor(Date.now() / 1000)) return (<Login auth={auth} setAuth={setAuth} />);
	
	return (<>
		<Routes>
			<Route path="" element={<Index auth={auth} />}/>
			<Route path="guild/:guildId"  element={<Guild auth={auth} />}>
				<Route path="" element={<GuildIndexComponent auth={auth} />}/>
				<Route path="moderation" element={<ModerationComponent auth={auth} />}/>
				<Route path="commands" element={<CommandsComponent auth={auth} />}/>
				<Route path="levels" element={<LevelsComponent auth={auth} />}/>
				<Route path="annoucements"  element={<AnnoucementsComponent auth={auth} />} />
				<Route path="autorole" element={<AutoroleComponent auth={auth} />}/>
				<Route path="log" element={<LogComponent auth={auth} />}/>
			</Route>
			<Route path="*" element={<NotFound />}/>
		</Routes>
	</>);
}

export default App;