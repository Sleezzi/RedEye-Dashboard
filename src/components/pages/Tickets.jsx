import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild.tickets.module.css";
import Save from "../Save";

function Tickets({ auth, notify }) {
	const { guild, setGuild } = useOutletContext();
	const [tickets, setTickets] = useState(guild.tickets || {});
	const [search, setSearch] = useState({
		search: "",
		type: "content"
	});
	
	useEffect(() => setTickets(guild.tickets), [guild.tickets]);
	useEffect(() => {
		console.log(guild.tickets, tickets);
	}, [guild.tickets, tickets]);
	
	const save = async () => {
		try {
			const response = await fetch(`https://api-redeye.sleezzi.fr/setTickets?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth.token
				},
				body: JSON.stringify(tickets)
			});
			if (response.status === 200) {
				setGuild(g => ({...g, tickets}))
				return "Success";
			}
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		} catch (error) {
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		}
	}
	const convertDate = (date) => {
		const newDate = new Date(date);
		return `${(newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate())}/${(newDate.getMonth()+1 < 10 ? `0${newDate.getMonth()+1}` : newDate.getMonth()+1)}/${(newDate.getFullYear() < 10 ? `0${newDate.getFullYear()}` : newDate.getFullYear())} ${(newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours())}:${(newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes())}:${(newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds())}`
	}
	return (
		<main className={styles.content}>
			<h2>Tickets</h2>
			<div className={styles.containerSearch}>
				<input type="text" placeholder="Search" className={styles.search}  onChange={(e) => {
					setSearch(s => ({...s, search: e.target.value.toLowerCase()}))
				}}/>
				<select value={search.type} onChange={(e) => {
					setSearch(s => ({...s, type: e.target.selectedOptions[0].value}))
				}} >
					<option value="content">Search by: Content</option>
					<option value="author">Search by: Author</option>
				</select>
			</div>
			<div className={styles.userContainer}>
				{
					Object.entries(tickets)
					.filter(([id, user]) => {
						if (Object.keys(user.tickets).length === 0) return false;
						if (search.type !== "author") return true;
						if (search.search.length < 3) return true;
						if (user.username.toLowerCase().includes(search.search) || id.includes(search.search)) return true;
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
										if (search.type !== "content") return true;
										if (search.search.length < 3) return true;
										if (!ticket.content.toLowerCase().includes(search.search)) return false;
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