import React, { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/autorole.module.css";
import Save from "../Save";
import { Autorole as AutoroleInterface, Client, Guild } from "../../interfacies";

function Autorole({ token, client }: {token: string, client: Client}) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>> } = useOutletContext();
	const [autoroles, setAutoroles] = useState<AutoroleInterface>(guild.modules.autoroles ? guild.modules.autoroles[0] : {role: "unset", type: "human"});
	
	
	// const addAutorole = () => {
	// 	if (!autoroles) {
	// 		return;
	// 	}
	// 	if (autoroles?.find((role) => role.role === "unset")) {
	// 		return;
	// 	}
	// 	if (autoroles?.length === 3) {
	// 		return;
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
			const response = await fetch(`${client.url}/modules/autoroles?id=${guild.id}`, {
				method: "PUT",
				headers: {
				"Content-Type": "application/json",
				authorization: token
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
			return "Error";
		} catch (error) {
			return "Error";
		}
	}
	
	return (
		<main className={styles.content}>
		<h2>Autorole</h2>
		<div className={styles.roleContainer}>
				<h3>Role</h3>
				<select name="role" value={autoroles?.role} onChange={(e) => 
					setAutoroles((roles: any) => ({...roles, role: e.target.value}))
				}>
				{autoroles?.role === "unset" ? <option value="unset" disabled>Please choose a role</option> : <option disabled value={autoroles.role}>{guild.roles.find(role => role.id === autoroles.role)?.name}</option>}
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
		<Save comparator={JSON.stringify(guild.modules.autoroles ? guild.modules.autoroles[0] : {role: "unset", type: "human"}) !== JSON.stringify(autoroles)} reset={() => {
			setAutoroles(guild.modules.autoroles ? guild.modules.autoroles[0] : {role: "unset", type: "human"});
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
