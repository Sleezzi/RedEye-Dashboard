import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/commands.module.css";
import Save from "../Save";
import Input from "../InputComponent";
import { Auth, Guild, Notify } from "../../interfacies";

function Commands({ auth, notify }: {auth: Auth, notify: Notify}) {
	const { guild, setGuild }: {guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>} = useOutletContext();
	const [commands, setCommands] = useState({...guild.commands});
	const [customCommands, setCustomCommands] = useState(Object.entries(guild.commands.custom));
	const save = async () => {
		try {
			const response = await fetch(`https://api-redeye.sleezzi.fr/commands/disabled?id=${guild.id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth.token
				},
				body: JSON.stringify(commands.disabled)
			});
			if (response.status === 200) {
				setGuild((cmd: any) => ({...cmd, disabled: commands}));
				return "Success";
			}
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		} catch (error) {
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		}
	}
	const addCustomCommand = () => {
		if (JSON.stringify(Object.entries(guild.commands?.custom as Object).map(([name, message]) => ({name, message}))) !== JSON.stringify(customCommands)) return;
		if (guild.offer && guild.offer.toLowerCase() === "premium") {
			if (Object.keys(customCommands).length >= 10) {
				notify("Error", "Vous avez atteint la limite de commandes pesonnalisées.", 5);
				return;
			}
		} else {
			if (Object.keys(customCommands).length >= 3) {
				notify("Error", "Vous avez atteint la limite de commandes pesonnalisées, prenez l'offre Premium pour en avoir plus.", 5);
				return;
			}
		}
		setCustomCommands((cmds: any) => ([{name: "Untitled", message: "undefined"}, ...cmds]));
	}

	return (
		<main className={styles.content}>
			<h2>Commands</h2>
			<div>
				{/* <h3>Custom command</h3>
				<button onClick={addCustomCommand}>Ajouter des commandes</button>
				<div className={styles.customCommandContainer}>
					{
						Object.entries(guild.commands.custom).map(([name, message], index) => (
							<div key={name} className={styles.customCommand}>
								<Input
									onChange={(e) => {
										// e.target.value = e.target.value.toLowerCase();
										// const cmd = [...customCommands];
										// cmd[index] = {
										// 	name: cmd[index].name,
										// 	message: e.target.value
										// }
										// setCustomCommands(cmd);
									}}
									className={styles.input}
									defaultValue={name === "Untitled" ? "" : name}
									placeholder="Le nom de la commande"
									maxLength={10}
								/>
								<button className={styles.delete}>✕</button>
								<Input
									className={styles.input}
									onChange={(e) => {
										// const cmd = [...customCommands];
										// cmd[index] = {
										// 	name: cmd[index].name,
										// 	message: e.target.value
										// }
										// setCustomCommands(cmd);
									}}
									defaultValue={message === "undefined" ? "" : message}
									placeholder="Le message qui s'affichera quand la commande est executé"
									maxLength={1000}
								/>
								<button className={styles.save} onClick={(e: any) => {
									if (e.target.disabled) return;
									e.target.disabled = true;
									fetch(`https://api-redeye.sleezzi.fr/commands/new?id=${guild.id}`, {
										method: "POST",
										headers: {
											Authorization: auth.token
										},
										body: JSON.stringify({
											[name]: message
										})
									})
									.then(response => {
										e.target.removeAttribute("disabled");
										if (response.status === 200) {
											return;
										}
										return response.json();
									}).then(response => {
										if (!response) return;
										if (response.msg === "Invalid body" || response.msg === "") {
											return;
										}
									})
								}}>Save</button>
							</div>
						))
					}
				</div> */}
			</div>
			<div className={styles.disabled_cmd}>{
				commands.disabled.map(command => <button key={command} onClick={(e: any) => {
					const newCommandsData = [...commands.disabled];
					newCommandsData.splice(newCommandsData.findIndex(cmd => cmd === e.target.innerText), 1);
					setCommands(cmd => ({...cmd, disabled: newCommandsData}));
				}}>{command}</button>) || "Please wait..."
			}</div>
			<div>
				<h3>Disable command</h3>
				<select defaultValue="none" onChange={(e) => {
					if (e.target.selectedOptions[0].value === "none") return;
					const newCommandsData = [...commands.disabled];
					newCommandsData.push(e.target.selectedOptions[0].value);
					setCommands(cmd => ({...cmd, disabled: newCommandsData}));
					e.target.value = "none";
				}} id={styles.commands}>
					<option value="none">Select command</option>
					{
						commands.app
						.map(command => commands.disabled.find(cmd => cmd === command.name) ? <option key={command.name} disabled value={command.name}>{command.name}</option> : <option key={command.name} value={command.name}>{command.name}</option>)
					}{
						commands.prefix
						.filter(command => !commands.app.find(cmd => cmd.name === command.name))
						.map(command => commands.disabled.find(cmd => cmd === command.name) ? <option key={command.name} disabled value={command.name}>{command.name}</option> : <option key={command.name} value={command.name}>{command.name}</option>)
					}
				</select>
			</div>
			<Save comparator={JSON.stringify(commands) !== JSON.stringify(guild.commands)} reset={() => setCommands(cmd => ({...cmd, disabled: guild.commands.disabled}))} save={save}/>
		</main>
	);
}

export default Commands;