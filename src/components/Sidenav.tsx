import { Link, useLocation } from "react-router-dom";

import styles from "../cdn/css/sidenav.module.css";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Guild } from "../interfacies";

function Sidenav({ sidenav, setSidenav, guild }: { sidenav: boolean, setSidenav: Dispatch<SetStateAction<boolean>>, guild: Guild }) {
	const location = useLocation();
	useEffect(() => {
		(document.querySelectorAll(`.${styles.sidenav} a`) as NodeListOf<HTMLAnchorElement>).forEach(element => {
			if (element.href === window.location.href) {
				element.className = styles.active;
			} else {
				element.className = "";
			}
		});
	}, [location.pathname]);
	
	return (<>
		<div className={`${styles.sidenav} ${sidenav ? styles.active : ""}`}>
			<div className={styles.container}>
				<Link to={``}>
				<span className="material-symbols-outlined">home</span>
					<h3>Globals</h3>
				</Link>
				<Link to="moderation">
					<span className="material-symbols-outlined">security</span>
					<h3>Moderation</h3>
				</Link>
				<Link to="commands">
					<span className="material-symbols-outlined">view_module</span>
					<h3>Commands</h3>
				</Link>
				<Link to="levels">
					<span className="material-symbols-outlined">rocket_launch</span>
					<h3>Levels</h3>
				</Link>
				<Link to="join">
					<span className="material-symbols-outlined">person_add</span>
					<h3>Join</h3>
				</Link>
				<Link to="leave">
					<span className="material-symbols-outlined">person_remove</span>
					<h3>Leave</h3>
				</Link>
				<Link to="autonick">
					<span className="material-symbols-outlined">edit</span>
					<h3>Autonick</h3>
				</Link>
				<Link to="autorole">
					<span className="material-symbols-outlined">assignment_add</span>
					<h3>Autorole</h3>
				</Link>
				<Link to="log">
					<span className="material-symbols-outlined">history</span>
					<h3>Log</h3>
				</Link>
				<Link to="tickets">
					<span className="material-symbols-outlined">local_activity</span>
					<h3>Tickets</h3>
				</Link>
				<Link to="rss">
					<span className="material-symbols-outlined">rss_feed</span>
					<h3>RSS</h3>
				</Link>
			</div>
			<div className={styles.containerGuild}>
				{guild.icon ? <img className={styles.icon} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={`Icon of ${guild.name}`} /> : <h2 className={styles.icon}>{guild.name.replace(/\W&^ /g, "").toUpperCase().split(" ", 3).map(string => string[0]).join("")}</h2>}
				<h3>{guild.name}</h3>
			</div>
		</div>
		<button className={sidenav ? styles.active : ""} onClick={() => setSidenav(false)} id={styles.close}></button>
	</>);
}
export default Sidenav;