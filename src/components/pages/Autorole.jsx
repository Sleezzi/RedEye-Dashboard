import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild.log.module.css";
import Save from "../Save";

function Autorole({ auth }) {
	const { guild, setGuild } = useOutletContext();
	const [roles, setRoles] = useState([{ id: "0", name: "Please wait...", color: "#FFFFFF", position: 1, permissions: 0 }]);
	const [modules, setModules] = useState(guild.modules || {
		autorole: ""
	});
	
	useEffect(() => setModules(guild.modules), [guild.modules]);
	useEffect(() => guild.roles ? setRoles(guild.roles) : undefined, [guild.roles]);
	
	const save = async () => {
		const response = await fetch(`https://api-redeye.sleezzi.fr/modules?id=${guild.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth.token
			},
			body: JSON.stringify(modules)
		});
		if (response.status === 200) {
			setGuild(oldGuild => ({...oldGuild,
				modules: modules
			}));
			return "Success";
		} else return "Error";
	}
	return (
		<main className={styles.content}>
			<h2>Autorole</h2>
			<h4>{roles.find(role => role.id === modules.autorole) ? <>Current "<b style={{color: roles.find(role => role.id === modules.autorole).color === "#000000" ? "#FFF" : roles.find(role => role.id === modules.autorole).color}}>{roles.find(role => role.id === modules.autorole).name}</b>" (<i>{roles.find(role => role.id === modules.autorole).id}</i>)</> : "Please select a channel"}</h4>
			<div className={styles.container}>
				<select id="role" defaultValue="none" onChange={(e) => {
					if (e.target.selectedOptions[0].value === "none") return;
					setModules(mods => ({...mods, autorole: e.target.selectedOptions[0].value }));
				}}>
					<option value="none">Select a role</option>
					{
						roles.filter(role => role.name !== "@everyone").map(role => role.id === modules.autorole ? <option key={role.id} disabled value={role.id}>{role.name}</option> : <option key={role.id} value={role.id}>{role.name}</option>)
					}
				</select>
				<button onClick={() => {
					setModules(mods => ({...mods, role: mods.role ? undefined : guild.modules.autorole }));
					document.querySelector(`.${styles.container} select#role`).value = "none";
				}} className={`switch ${modules.autorole ? "active" : ""}`} />
			</div>
			<Save comparator={JSON.stringify(guild.modules) !== JSON.stringify(modules)} reset={() => {
				setModules(guild.modules);
				document.querySelector(`.${styles.container} select#role`).value = "none";
			}} save={save} />
		</main>
	);
}

export default Autorole;