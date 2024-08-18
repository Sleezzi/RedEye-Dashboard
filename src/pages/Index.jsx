import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

import styles from "../cdn/css/index.module.css";

function Index({ auth }) {
	const [guilds, setGuilds] = useState([]);
	useEffect(() => {
		fetch("https://discord.com/api/users/@me/guilds", {
			headers: {
				Authorization: auth.token
			}
		})
		.then(response => response.json())
		.then(response => setGuilds(response));
	}, []);
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
					guilds.filter(guild => (guild.permissions & 32) === 32).map(guild => (<Link to={`/guild/${guild.id}`} className={styles.guild} key={guild.id}>
						<div className={styles.banner}></div>
						{guild.icon ? <img className={styles.icon} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`Icon of ${guild.name}`} /> : <h2 className={styles.icon}>{guild.name.split(" ", 3).map(string => string.slice(0, 1).toUpperCase()).join("")}</h2>}
						<img className={styles.role} src={(guild.permissions & 8) === 8 ? "/cdn/img/icon/admin.png" : "/cdn/img/icon/mod.png"} alt="Status" />
						<h3>{guild.name}</h3>
					</Link>))
				}
			</main>
			<Footer />
		</>
	);
}

export default Index;