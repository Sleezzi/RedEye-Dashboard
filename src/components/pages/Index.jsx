import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/index.module.css";
import Save from "../Save";

function Index({ auth, notify }) {
	const { guild,setGuild } = useOutletContext();
	const [prefix, setPrefix] = useState(guild.prefix);
	const save = async () => {
		try {
			const response = await fetch(`http://localhost:20659/guild/setPrefix?id=${guild.id}&prefix=${prefix}`, {
				method: "PUT",
				headers: {
					Authorization: auth.token
				}
			});
			if (response.status === 200) {
				setGuild(oldGuild => ({...oldGuild,
					prefix: prefix
				}));
				return "Success";
			}
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		} catch (error) {
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		}
	}
	
	useEffect(() => setPrefix(guild.prefix), [guild.prefix]);
	return (
		<main className={styles.content}>
			<h2>Prefix</h2>
			<input className={styles.prefix} type="text" value={prefix} onChange={(e) => {
				if (e.target.value.length > 3) return;
				if (/@|#|:|\`|\\|\||\*|\/| /.test(e.target.value)) return;
				setPrefix(e.target.value.toLowerCase());
			}}/>
			<div className={styles.container}>
				<h4>
					<b>{prefix}</b>
					about
				</h4>
				<h4>
					<b>{prefix}</b>
					help
				</h4>
				<h4>
					<b>{prefix}</b>
					userinfo @RedEye
				</h4>
			</div>
			<Save comparator={guild.prefix !== prefix && prefix.length !== 0} reset={() => setPrefix(guild.prefix)} save={save}/>
		</main>
	);
}

export default Index;