import React, { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/autorole.module.css";
import Save from "../Save";
import { Auth, Guild, Notify } from "../../interfacies";
import Input from "../InputComponent";

function Autonick({ auth, notify }: {auth: Auth, notify: Notify}) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>> } = useOutletContext();
	const [autonick, setAutonick] = useState<any>(guild.modules.autonick ? guild.modules.autonick[0] : { type: "join", value: "$user" });
	
	// const addAutonick = () => {
	// 	if (!autonick) {
	// 		return notify("Error", "Please retry...");
	// 	}
	// 	if (autonick?.find((role) => role.role === "unset")) {
	// 		return notify("Error", "Vous avez déjà un role vierge créé, modifiez le et enregistrer le pour créer un nouvelle autorole", 5);
	// 	}
	// 	if (autonick?.length === 3) {
	// 		return notify("Error", "Vous avez atteint le nombre maximame d'autorole", 5);
	// 	}
	// 	const newAutonick = [...autonick];
	// 	newAutonick.unshift({
	// 		type: "join",
	// 		value: "$user"
	// 	});
	// 	setAutonick(newAutonick);
	// }

	const save = async () => {
		try {
			const response = await fetch(`http://localhost:20659/modules/autonick?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth.token
				},
				body: JSON.stringify([autonick])
			});
			if (response.status === 200) {
				
				const modules = {...guild.modules};
				if (!modules.autonick) modules.autonick = [];
				modules.autonick[0] = autonick;
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
			<h2>Autonick</h2>
			<div className={styles.roleContainer}>
				<h4>Type</h4>
				<select name="type" value={autonick.type || "join"} onChange={(e) => setAutonick((nick: any) => ({...nick, type: e.target.value === "join" ? "join" : "role"}))}>
					<option value="join">Join</option>
					<option value="role">Role</option>
				</select>
				{
					autonick.type === "role" ? (<>
					<h4>Role</h4>
						<select name="role" value={autonick.role || "unset"} onChange={(e) => setAutonick((nick: any) => ({...nick, role: e.target.value}))}>
							{!autonick.role ? <option disabled value="unset">Please choose a role</option> : <></>}
							{guild.roles.filter((role) => !role.name.startsWith("@")).map(_role => (
								_role.id === autonick.role ?
								(<option disabled value={_role.id}>{_role.name}</option>) :
								(<option value={_role.id}>{_role.name}</option>)
							))}
						</select>
					</>) : (<></>)
				}
				<h4>Value</h4>
				<Input maxLength={20} className={styles.value} defaultValue={autonick.value || ""} onChange={(e) => setAutonick((nick: any) => ({...nick, value: e.target.value}))} />
			</div>
			<Save comparator={
				JSON.stringify(guild.modules.autonick ? guild.modules.autonick[0] : { type: "join", value: ""}) !== JSON.stringify(autonick) &&
				(() => {
					if (autonick.type === "role") {
						if (!autonick.role) return false;
					}
					if (!autonick.value.includes("$user")) return false;
					if (autonick.value === "$user") return false;
					return true;
				})()} reset={() => {
				setAutonick(guild.modules.autonick ? guild.modules.autonick[0] : { type: "join", value: "$user" });
				if (!document.querySelector(`.${styles.container} select#role`)) return;
				(document.querySelector(`.${styles.container} select#role`) as HTMLSelectElement).value = "none";
			}} save={save} />
			{/* <button onClick={addAutonick}>Ajouter un autonick</button>
			{
				autonick?.map(({type, value, role}, index) => (<div key={`${type};${value}`} className={styles.roleContainer}>
					<h4>Type</h4>
					<select name="type" value={type} onChange={(e) => {
							const newAutonick = [...autonick || []];
							newAutonick[index].type = e.target.value === "join" ? "join" : "role";
							setAutonick(newAutonick);
						}}>
						<option value="join">Join</option>
						<option value="role">Role</option>
					</select>
					{
						type === "role" ? (<>
						<h4>Role</h4>
							<select name="role" value={role || "unset"} onChange={(e) => {
								const newAutonick = [...autonick || []];
								newAutonick[index].role = e.target.value;
								setAutonick(newAutonick);
							}}>
								{!role ? <option disabled value="unset">Please choose a role</option> : <></>}
								{guild.roles.filter((role) => !role.name.startsWith("@")).map(_role => (
									_role.id === role ?
									(<option disabled value={_role.id}>{_role.name}</option>) :
									(<option value={_role.id}>{_role.name}</option>)
								))}
							</select>
						</>) : (<></>)
					}
					<h4>Value</h4>
					<Input maxLength={20} className={styles.value} defaultValue={value} onChange={(e) => {
						const newAutonick = [...autonick || []];
						newAutonick[index].value = e.target.value;
						setAutonick(newAutonick);
					}} />
					<button className={styles.remove} onClick={() => {
						const newAutonick = [...autonick || []];
						newAutonick.splice(index, 1);
						setAutonick(newAutonick);
					}}>X</button>
				</div>))
			} */}
		</main>
	);
}

export default Autonick;