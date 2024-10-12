import { Outlet, useParams, Link } from "react-router-dom";
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
	const [error, setError] = useState<boolean>(false);
	
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(`https://api-redeye.sleezzi.fr/guild?id=${guildId}`, {
					headers: {
						Authorization: auth.token
					}
				});
				if (response.status === 401) {
					document.title = "RedEye";
					setError(true);
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
	if (error) return (<div className={styles.errorContainer}>
		<h2>The bot is not on this server</h2>
		<h3>To edit the bot's actions on this server you must first add it to the server</h3>
		<div className={styles.buttons}>
			<Link className={styles.back} to={`/`}>Back</Link>
			<Link className={styles.login} to={`/invite/${guildId}`}>Add the bot</Link>
		</div>
	</div>)
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