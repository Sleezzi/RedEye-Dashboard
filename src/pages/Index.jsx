import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

import styles from "../cdn/css/index.module.css";

function Index({ auth, notify }) {
	const [guilds, setGuilds] = useState([]);
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
			.then(setGuilds);
		} catch (error) {
			notify("Error", `An error occurred while loading data from the server`, 5);
		}
	}, [auth.token]);
	return (
		<>
			<header id={styles.header}>
				<Link to="/">
					<img src="https://redeye.sleezzi.fr/favicon.ico" alt="Home" />
					<h2>RedEye</h2>
				</Link>
				<button id={styles.disconnect} onClick={() => {
						localStorage.setItem("auth", JSON.stringify({ expireAt: 0 }));
						window.location.reload();
					}}>
						<span className="material-symbols-outlined">logout</span>
				</button>
			</header>
			<div id={styles.margin}></div>
			<main className={styles.container}>
				{
					guilds
					.filter(guild => (guild.permissions & 32) === 32)
					.map(guild => 
						<Link to={`/guild/${guild.id}`} className={styles.guild} key={guild.id}>
							{guild.banner ? <img src={`https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png`} alt={`Banner of ${guild.name}`} className={styles.banner} /> :<div className={styles.banner}></div>}
							{guild.icon ? <img className={styles.icon} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`Icon of ${guild.name}`} /> : <h2 className={styles.icon}>{guild.name.replace(/\W&^ /g, "").toUpperCase().split(" ", 3).map(string => string[0]).join("")}</h2>}
							<img className={styles.role} src={(guild.permissions & 8) === 8 ? "/cdn/img/icon/admin.png" : "/cdn/img/icon/mod.png"} alt="Status" />
							<h3>{guild.name}</h3>
						</Link>
					)
				}
			</main>
			<Footer />
		</>
	);
}

export default Index;