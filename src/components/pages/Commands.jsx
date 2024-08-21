import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild.commands.module.css";
import Save from "../Save";

function Commands({ auth, notify }) {
	const { guild } = useOutletContext();
	const [commandsStatic, setCommandsStatic] = useState({
		app: [],
		prefix: [],
		disabled: []
	});
	const [commands, setCommands] = useState({...commandsStatic});
	useEffect(() => {
		try {
			fetch(`https://api-redeye.sleezzi.fr/commands?id=${guild.id}`, {
				headers: {
					Authorization: auth.token
				}
			})
			.then(response => response.json())
			.then(response => {
				setCommands(response);
				setCommandsStatic({...response});
			});
		} catch (error) {
			notify("Error", "An error has occurred: Unable to load bot commands", 5);
		}
	}, []);
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
				setCommandsStatic(cmd => ({...cmd, disabled: commands}));
				return "Success";
			}
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		} catch (error) {
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		}
	}
	return (
		<main className={styles.content}>
			<h2>Commands</h2>
			<div className={styles.disabled_cmd}>{
				commands.disabled.map(command => <button key={command} onClick={(e) => {
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
						.map(command => commands.disabled.find(cmd => cmd === command.data.name) ? <option key={command.data.name} disabled value={command.data.name}>{command.data.name}</option> : <option key={command.data.name} value={command.data.name}>{command.data.name}</option>)
					}{
						commands.prefix
						.filter(command => !commands.app.find(cmd => cmd.data.name === command.name))
						.map(command => commands.disabled.find(cmd => cmd === command.name) ? <option key={command.name} disabled value={command.name}>{command.name}</option> : <option key={command.name} value={command.name}>{command.name}</option>)
					}
				</select>
			</div>
			<Save comparator={JSON.stringify(commands) !== JSON.stringify(commandsStatic)} reset={() => setCommands(cmd => ({...cmd, disabled: commandsStatic.disabled}))} save={save}/>
		</main>
	);
}

export default Commands;