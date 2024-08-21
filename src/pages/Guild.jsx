import { Outlet, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidenav from "../components/Sidenav";
import { useEffect, useState } from "react";

function Guild({ auth, notify }) {
	const [sidenav, setSidenav] = useState(false);
	const guildId = useParams().guildId;
	const [guildData, setGuildData] = useState({
		id: guildId,
		name: "",
		prefix: "!",
		modules: {},
		tickets: {}
	});
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(`https://api-redeye.sleezzi.fr/guild?id=${guildId}`, {
					headers: {
						Authorization: auth.token
					}
				});
				if (response.status === 401) {
					window.location.reload();
					return;
				}
				if (response.status === 400) {
					window.location.href = `https://discord.com/oauth2/authorize?client_id=1195058289931726848&permissions=1153933091732599&response_type=token&redirect_uri=https%3A%2F%2Fmanage-redeye.sleezzi.fr&integration_type=0&scope=identify+bot&guild_id=${guildId}`;
					return;
				}
				const response_1 = await response.json();
				response_1.id = guildId;
				setGuildData(response_1);
			} catch (error) {
				notify("Error", `An error occurred while loading data from the server ${guildId}`, 5);
			}
			
		})();
	}, []);
	useEffect(() => {
		document.title = `RedEye - ${guildData.name}'s Dashboard`;
	}, [guildData]);
	return (
		<>
			<Header sidenav={sidenav} setSidenav={setSidenav} />
			<div style={{ display: "flex", justifyContent: "space-between", height: "90%" }}>
				<Sidenav sidenav={sidenav} setSidenav={setSidenav} />
				<Outlet context={{guild: guildData, setGuild: setGuildData}} notify={notify}/>
			</div>
		</>
	);
}

export default Guild;