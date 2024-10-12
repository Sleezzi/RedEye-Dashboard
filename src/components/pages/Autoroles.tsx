import React, { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/autorole.module.css";
import Save from "../Save";
import { Auth, Guild, Notify } from "../../interfacies";

function Autorole({ auth, notify }: {auth: Auth, notify: Notify}) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>> } = useOutletContext();
	const [autoroles, setAutoroles] = useState<any>(guild.modules.autoroles ? guild.modules.autoroles[0] : {role: "unset", value: "$user"});
	
	
	// const addAutorole = () => {
	// 	if (!autoroles) {
	// 		return notify("Error", "Please retry...", 5);
	// 	}
	// 	if (autoroles?.find((role) => role.role === "unset")) {
	// 		return notify("Error", "Vous avez déjà un rôle vierge créé, modifiez-le et enregistrez-le pour créer un nouvel autorole", 5);
	// 	}
	// 	if (autoroles?.length === 3) {
	// 		return notify("Error", "Vous avez atteint le nombre maximal d'autoroles", 5);
	// 	}
	// 	const newAutoroles = [...autoroles];
	// 	newAutoroles.unshift({
	// 		role: "unset",
	// 		type: "unset" as any
	// 	});
	// 	setAutoroles(newAutoroles);
	// }
	
	const save = async () => {
		try {
		const response = await fetch(`http://localhost:20659/modules/autoroles?id=${guild.id}`, {
			method: "PUT",
			headers: {
			"Content-Type": "application/json",
			Authorization: auth.token
			},
			body: JSON.stringify([autoroles])
		});
		if (response.status === 200) {
			const modules = {...guild.modules};
			if (!modules.autoroles) modules.autoroles = [];
			modules.autoroles[0] = autoroles;
			setGuild((oldGuild: any) => ({...oldGuild, modules }));
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
		<h2>Autorole</h2>
		<div className={styles.roleContainer}>
				<h3>Role</h3>
				<select name="role" value={autoroles.role} onChange={(e) => 
					setAutoroles((roles: any) => ({...roles, role: e.target.value}))
				}>
				{autoroles.role === "unset" ? <option value="unset" disabled>Please choose a role</option> : <option disabled value={autoroles.role}>{guild.roles.find(role => role.id === autoroles.role)?.name}</option>}
				{
					guild.roles
					.filter((role) => !role.name.startsWith("@") && role.id !== autoroles.role)
					.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)
				}
				</select>
				<h3>Type</h3>
				<select name="type" value={autoroles.type || "human"} onChange={(e) => setAutoroles((roles: any) => ({...roles, type: e.target.value === "bot" ? "bot" : "human"}))}>
				{
					(() => {
					if (!autoroles.type === "unset" as any) {
						return (
							<>
								<option value="unset" disabled>Please choose an option</option>
								<option value="bot">Bot</option>
								<option value="human">Human</option>
							</>
						);
					}
					return (
						<>
							<option value="bot">Bot</option>
							<option value="human">Human</option>
						</>
					)
					})()
				}
				</select>
			</div>
		<Save comparator={JSON.stringify(guild.modules.autoroles ? guild.modules.autoroles[0] : {role: "unset", value: "$user"}) !== JSON.stringify(autoroles)} reset={() => {
			setAutoroles(guild.modules.autoroles ? guild.modules.autoroles[0] : {role: "unset", value: "$user"});
		}} save={save} />
		{/* <button onClick={addAutorole}>Add a role</button>
		{
			autoroles?.map(({type, role: autorole}, index) => (
			<div key={`${autorole};${type}`} className={styles.roleContainer}>
				<h3>Role</h3>
				<select name="role" defaultValue={autorole} onChange={(e) => 
					setAutoroles(roles => {
						const newRoles = [...roles!]; // Crée une copie du tableau
						newRoles[index].role = e.target.value; // Modifie la copie
						return newRoles; // Retourne la nouvelle copie
					})
				}>
				{autorole === "unset" ? <option value="unset" disabled>Please choose a role</option> : <option disabled value={autorole}>{guild.roles.find(role => role.id === autorole)?.name}</option>}
				{
					guild.roles
					.filter((role) => !role.name.startsWith("@") && role.id !== autorole)
					.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)
				}
				</select>
				<h3>Type</h3>
				<select name="type" defaultValue={type} onChange={(e) => 
					setAutoroles((roles: any) => ([...roles, (() => {
						const newRoles = roles![index]; // Crée une copie du tableau
						newRoles.type = e.target.value === "bot" ? "bot" : "human";
						console.log(newRoles.type, autoroles[index].type, e.target.value);
						return newRoles; // Retourne la nouvelle copie
					})()]))
				}>
				{
					(() => {
					if (type === "unset" as any) {
						return (
							<>
								<option value="unset" disabled>Please choose an option</option>
								<option value="bot">Bot</option>
								<option value="human">Human</option>
							</>
						);
					}
					return (
						<>
							<option value="bot">Bot</option>
							<option value="human">Human</option>
						</>
					)
					})()
				}
				</select>
				<button className={styles.remove} onClick={() => {
					const newAutoroles = [...autoroles];
					newAutoroles.splice(index, 1);
					setAutoroles(newAutoroles);
				}}>X</button>
			</div>
			))
		} */}
		</main>
	);
 }

export default Autorole;
