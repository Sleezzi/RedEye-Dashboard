import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/index.module.css";
import Save from "../Save";
import { Client, Guild, User } from "../../interfacies";

function Index({ token, client }: { token: string, client: Client }) {
	const { guild,setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [prefix, setPrefix] = useState(guild.prefix);
	const save = async () => {
		try {
			const response = await fetch(`${client.url}/setPrefix?id=${guild.id}&prefix=${prefix}`, {
				method: "PUT",
				headers: {
					authorization: token
				}
			});
			if (response.status === 200) {
				setGuild((oldGuild: any) => ({...oldGuild,
					prefix: prefix
				}));
				return "Success";
			}
			return "Error";
		} catch (error) {
			return "Error";
		}
	}
	
	useEffect(() => setPrefix(guild.prefix), [guild.prefix]);
	return (
		<main className={styles.content}>
			<h2>Prefix</h2>
			<input className={styles.prefix} type="text" value={prefix} onChange={(e) => {
				if (e.target.value.length > 3) return;
				if (/@|#|:|\`|\\|\||\*|\/| |_/.test(e.target.value)) return;
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