import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import NotFound from "./pages/404";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Invite from "./pages/Invite";
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

import RSS from "./components/pages/RSS";
import RSS_YouTube from "./components/pages/RSS/YouTube";
import RSS_Twitch from "./components/pages/RSS/Twitch";
import RSS_Reddit from "./components/pages/RSS/Reddit";
import RSS_GitHub_Issues from "./components/pages/RSS/GitHub/Issues";

import "./cdn/css/main.css";
import { Client, getCookie } from "./interfacies";

function App() {
	const client: Client = {
		id: "1195058289931726848",
		url: "https://api-redeye.sleezzi.fr"
	}
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
	const [token, setToken] = useState(getCookie("token"));
	const [loading, setLoading] = useState(0);
	
	if (!token) return (<Routes>
		<Route path="" element={<Login />}/>
		<Route path="*" element={<Login />}/>
		<Route path="invite" element={<Invite client={client} />}/>
	</Routes>);
	
	return (
		<AnimatePresence mode="wait">
			<Routes>
				<Route path="" element={<Index token={token} setLoading={setLoading} />}/>
				<Route path="invite/:guild" element={<Invite client={client} />}/>
				<Route path="guild/:guildId" element={<Guild token={token} client={client} />}>
					<Route path="" element={<GuildIndexComponent token={token} client={client} />}/>
					<Route path="moderation" element={<ModerationComponent token={token} client={client} />}/>
					<Route path="commands" element={<CommandsComponent token={token} client={client} />}/>
					<Route path="levels" element={<LevelsComponent token={token} client={client} />}/>
					<Route path="join"  element={<JoinComponent token={token} client={client} />} />
					<Route path="leave"  element={<LeaveComponent token={token} client={client} />} />
					<Route path="autorole" element={<AutorolesComponent token={token} client={client} />}/>
					<Route path="autonick" element={<AutonickComponent token={token} client={client} />}/>
					<Route path="log" element={<LogComponent token={token} client={client} />}/>
					<Route path="tickets" element={<TicketsComponent token={token} client={client} />}/>
					<Route path="rss">
						<Route path="" element={<RSS />}/>
						<Route path="youtube" element={<RSS_YouTube token={token} client={client} />}/>
						<Route path="twitch" element={<RSS_Twitch token={token} client={client} />}/>
						<Route path="reddit" element={<RSS_Reddit token={token} client={client} />}/>
						<Route path="github" element={<RSS_GitHub_Issues token={token} client={client} />}/>
					</Route>
				</Route>
				<Route path="*" element={<NotFound />}/>
			</Routes>
		</AnimatePresence>
	);
}

export default App;