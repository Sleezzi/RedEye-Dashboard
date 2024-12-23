import React, { Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/log.module.css";
import Save from "../Save";
import { Client, Guild, User } from "../../interfacies";

function Log({ token, client }: { token: string, client: Client }) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [channels, setChannels] = useState([{ id: "0", name: "Please wait...", type: 0, permissions: 0 }]);
	const [modules, setModules] = useState(guild.modules || {
		log: ""
	});
	
	useEffect(() => setModules(guild.modules), [guild.modules]);
	useEffect(() => guild.channels ? setChannels(guild.channels) : undefined, [guild.channels]);
	
	const save = async () => {
		try {
			const response = await fetch(`${client.url}/modules?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token
				},
				body: JSON.stringify(modules)
			});
			if (response.status === 200) {
				setGuild((oldGuild: any) => ({...oldGuild,
					modules: modules
				}));
				return "Success";
			}
			return "Error";
		} catch (error) {
			return "Error";
		}
	}
	return (
		<main className={styles.content}>
			<h2>Log</h2>
			<h4>{channels.find(channel => channel.id === modules.log) ? <>Current "<b>{channels?.find(channel => channel.id === modules.log)?.name}</b>" (<i>{channels.find(channel => channel.id === modules.log)?.id}</i>)</> : "Please select a channel"}</h4>
			<div className={styles.container}>
				<select id="log" defaultValue="none" onChange={(e) => {
					if (e.target.selectedOptions[0].value === "none") return;
					setModules(mods => ({...mods, log: e.target.selectedOptions[0].value }));
				}}>
					<option value="none">Select a channel</option>
					{
						channels.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => channel.id === modules.log ? <option key={channel.id} disabled value={channel.id}>{channel.name}</option> : <option key={channel.id} value={channel.id}>{channel.name}</option>)
					}
				</select>
				<button onClick={() => {
					setModules((mods: any) => ({...mods, log: mods.log ? undefined : guild.modules.log }));
					(document.querySelector(`.${styles.container} select#log`) as HTMLInputElement).value = "none";
				}} className={`switch ${modules.log ? "active" : ""}`} />
			</div>
			<Save comparator={JSON.stringify(guild.modules) !== JSON.stringify(modules)} reset={() => {
				setModules(guild.modules);
				(document.querySelector(`.${styles.container} select#log`) as HTMLInputElement).value = "none";
			}} save={save} />
		</main>
	);
}

export default Log;