import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/tickets.module.css";
import Save from "../Save";
import { Auth, Guild, Notify } from "../../interfacies";

function Tickets({ auth, notify }: { auth: Auth, notify: Notify }) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>> } = useOutletContext();
	const [tickets, setTickets] = useState<Guild["tickets"]>(guild.tickets);
	const [search, setSearch] = useState<{
		search: string,
		type: "content" | "author"
	}>({
		search: "",
		type: "content"
	});
	
	useEffect(() => setTickets(guild.tickets), [guild.tickets]);
	
	const save = async () => {
		try {
			const response = await fetch(`http://localhost:20659/setTickets?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth.token
				},
				body: JSON.stringify(tickets)
			});
			if (response.status === 200) {
				setGuild((g: any) => ({...g, tickets}))
				return "Success";
			}
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		} catch (error) {
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		}
	}
	const convertDate = (date: number) => {
		const newDate = new Date(date);
		return `${(newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate())}/${(newDate.getMonth()+1 < 10 ? `0${newDate.getMonth()+1}` : newDate.getMonth()+1)}/${(newDate.getFullYear() < 10 ? `0${newDate.getFullYear()}` : newDate.getFullYear())} ${(newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours())}:${(newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes())}:${(newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds())}`
	}
	return (
		<main className={styles.content}>
			<h2>Tickets</h2>
			<div className={styles.containerSearch}>
				<input type="text" placeholder="Search" className={styles.search}  onChange={(e) => {
					setSearch((s: any) => ({...s, search: e.target.value.toLowerCase()}))
				}}/>
				<select value={search?.type} onChange={(e) => {
					setSearch((s: any) => ({...s, type: e.target.selectedOptions[0].value}))
				}} >
					<option value="content">Search by: Content</option>
					<option value="author">Search by: Author</option>
				</select>
			</div>
			<div className={styles.userContainer}>
				{
					Object.entries(tickets)
					.filter(([userId, user]) => {
						if (Object.keys(user).length === 0) return false;
						if (!search?.search) return true;
						if (search?.type !== "author") return true;
						if (user.username.toLowerCase().includes(search.search.toLowerCase()) || userId.includes(search.search)) return true;
					})
					.map(([userId, user]) => 
						<div className={styles.userContainer} key={userId}>
							<div className={styles.profile}>
								<img src={user.avatar} alt={`Avatar of ${user.username}`} />
								<h3>{user.username}</h3>
							</div>
							<div className={styles.ticketsContainer}>
								{
									Object.entries(user.tickets)
									.filter(([id, ticket]) => {
										if (!search?.search) return true;
										if (search?.type !== "content") return true;
										if (ticket.content.toLowerCase().includes(search.search.toLowerCase())) return true;
									})
									.map(([id, ticket]) =>
										<div key={id} className={styles.ticket}>
											<button className={styles.remove} onClick={() => {
												const newTickets = {...tickets[userId].tickets};
												delete newTickets[id];
												setTickets(t => ({...t, [userId]: {
													username: t[userId].username,
													avatar: t[userId].avatar,
													tickets: newTickets
												}}));
											}}>✕</button>
											<p className={styles.message}>{ticket.content}</p>
											<p className={styles.date}>{convertDate((ticket.updateAt || ticket.madeAt) * 1000)}</p>
										</div>
									)
								}
							</div>
						</div>
					)
				}
			</div>
			<Save comparator={JSON.stringify(guild.tickets) !== JSON.stringify(tickets)} reset={() => setTickets(guild.tickets)} save={save} />
		</main>
	);
}

export default Tickets;