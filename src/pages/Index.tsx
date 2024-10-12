import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

import { Auth, DiscordGuild, Guild, Notify } from "../interfacies";

import styles from "../cdn/css/index.module.css";

function Index({ auth, notify }: { auth: Auth, notify: Notify }) {
	const [guilds, setGuilds] = useState<DiscordGuild[]>();
	useEffect(() => {
		try {
			fetch("https://discord.com/api/users/@me/guilds", {
				headers: {
					Authorization: auth.token
				}
			})
			.then(response => {
				if (response.status !== 200) {
					notify("Error", `An error occurred while loading data from the server`, 5);
					return {};
				}
				return response.json();
			})
			.then((response: any) => {
				setGuilds(response);
			});
		} catch (error) {
			notify("Error", `An error occurred while loading data from the server`, 5);
		}
	}, [auth.token]);
	return (
		<>
			<Header sidenav={undefined} setSidenav={undefined} />
			<main className={styles.container}>
				{
					guilds ?
					guilds
					.filter((guild: any) => (guild.permissions & 32) === 32)
					.map((guild: any) => 
						<Link to={`/guild/${guild.id}`} className={styles.guild} key={guild.id}>
							{guild.banner ? <img src={`https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png`} alt={`Banner of ${guild.name}`} className={styles.banner} /> :<div className={styles.banner}></div>}
							{guild.icon ? <img className={styles.icon} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`Icon of ${guild.name}`} /> : <h2 className={styles.icon}>{guild.name.replace(/\W&^ /g, "").toUpperCase().split(" ", 3).map((string: string) => string[0]).join("")}</h2>}
							<img className={styles.role} src={(guild.permissions & 8) === 8 ? "/cdn/img/icon/admin.png" : "/cdn/img/icon/mod.png"} alt="Status" />
							<h3>{guild.name}</h3>
						</Link>
					) : "Please wait..."
				}
			</main>
			<Footer />
		</>
	);
}

export default Index;