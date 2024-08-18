import { Link, useLocation, useParams } from "react-router-dom";

import styles from "../cdn/css/sidenav.module.css";
import { useEffect } from "react";

function Sidenav({ sidenav, setSidenav }) {
	const location = useLocation();
	useEffect(() => {
		document.querySelectorAll(`.${styles.sidenav} a`).forEach(element => {
			if (element.href === window.location.href) {
				element.className = styles.active;
			} else {
				element.className = "";
			}
		})
	}, [location.pathname]);
	
	return (<>
		<div className={`${styles.sidenav} ${sidenav ? styles.active : ""}`}>
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
			<Link to="annoucements">
				<span className="material-symbols-outlined">campaign</span>
				<h3>Annoucements</h3>
			</Link>
			<Link to="autorole">
				<span className="material-symbols-outlined">person_add</span>
				<h3>Autorole</h3>
			</Link>
			<Link to="log">
				<span className="material-symbols-outlined">history</span>
				<h3>Log</h3>
			</Link>
		</div>
		<button className={sidenav ? styles.active : ""} onClick={() => setSidenav(false)} id={styles.close}></button>
	</>);
}
export default Sidenav;