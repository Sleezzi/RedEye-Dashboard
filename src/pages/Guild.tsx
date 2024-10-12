import { Outlet, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidenav from "../components/Sidenav";
import { useEffect, useState } from "react";

import styles from "../cdn/css/guild.module.css";
import { Auth, Guild as GuildInterface, Notify, User } from "../interfacies";

function Guild({ auth, notify }: { auth: Auth, notify: Notify }) {
	const [sidenav, setSidenav] = useState(false);
	const [user, setUser] = useState<User>();
	const guildId = useParams().guildId;
	const [guildData, setGuildData] = useState<GuildInterface | undefined>();
	
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(`http://localhost:20659/guild?id=${guildId}`, {
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
				const data: GuildInterface = await response.json();
				setGuildData({...data, id: guildId as string});
				setUser({
					id: data.user.id,
					avatar: data.user.avatar,
					banner: data.user.banner,
					username: data.user.username
				});
			} catch (error) {
				notify("Error", `An error occurred while loading data from the server ${guildId}`, 5);
			}
		})();
	}, [auth.token, guildId]);
	useEffect(() => {
		document.title = `RedEye - ${guildData?.name}'s Dashboard`;
	}, [guildData?.name]);
	if (!guildData) return <>Please wait...</>;
	return (
		<>
			<Header sidenav={sidenav} setSidenav={setSidenav} />
			<div className={styles.container}>
				<Sidenav sidenav={sidenav} setSidenav={setSidenav} guild={guildData} />
				<Outlet context={{guild: guildData, setGuild: setGuildData, user}} />
			</div>
		</>
	);
}

export default Guild;