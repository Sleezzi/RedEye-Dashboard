import { Outlet, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidenav from "../components/Sidenav";
import { useEffect, useState } from "react";

function Guild({ auth }) {
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
		fetch(`https://api-redeye.sleezzi.fr/guild?id=${guildId}`, {
			headers: {
				Authorization: auth.token
			}
		})
		.then(response => response.json())
		.then(response => {
			if (response.status === 401) {
				window.location.reload();
				return;
			}
			if (response.status === 404) {
				localStorage.setItem("redirect", window.location.href);
				window.location.href = `https://discord.com/oauth2/authorize?client_id=1232706723148726373&permissions=1153933091732599&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2F&integration_type=0&scope=identify+bot&guild_id=${guildId}`;
				return;
			}
			response.id = guildId;
			setGuildData(response);
		});
	}, []);
	useEffect(() => {
		document.title = `RedEye - ${guildData.name}'s Dashboard`;
	}, [guildData]);
	return (
		<>
			<Header sidenav={sidenav} setSidenav={setSidenav} />
			<div style={{ display: "flex", justifyContent: "space-between", height: "90%" }}>
				<Sidenav sidenav={sidenav} setSidenav={setSidenav} />
				<Outlet context={{guild: guildData, setGuild: setGuildData}} />
			</div>
		</>
	);
}

export default Guild;