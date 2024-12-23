import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

import { DiscordGuild } from "../interfacies";

import styles from "../cdn/css/index.module.css";
import Loading from "../components/Loading";
import Transition from "../components/Transition";

function Index({ token, setLoading }: { token: string, setLoading: React.Dispatch<React.SetStateAction<number>> }) {
	const [guilds, setGuilds] = useState<DiscordGuild[]>();
	useEffect(() => {
		try {
			fetch("https://discord.com/api/users/@me/guilds", {
				headers: {
					authorization: token
				}
			})
			.then(response => {
				if (response.status !== 200) {
					return {};
				}
				return response.json();
			})
			.then((response: any) => {
				setGuilds(response);
			});
		} catch (error) {}
	}, [token]);
	return (
		<>
			<Header />
			<main className={styles.container} {...{loaded: guilds ? "true" : "false", noserver: guilds?.length === 0 ? "true" : "false"}} >
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
					) : <Loading/>
				}
				{
					guilds?.length === 0 ?  <>
						<span style={{fontSize: "5rem"}} className="material-symbols-outlined">running_with_errors</span>
						<h2>There are no servers you can manage</h2>
						<h3>Create a server then refresh this page</h3>
					</> : <></>
				}
			</main>
			<Footer />
		</>
	);
}

export default Index;