import { Link } from "react-router-dom";

import styles from "../cdn/css/header.module.css";

function Header({ sidenav, setSidenav }) {
	return (<>
		<header className={styles.header}>
			<button id={styles.sidenav} onClick={() => setSidenav(sidenav ? false : true)}>
				<span></span>
				<span></span>
				<span></span>
			</button>
			<Link to="/">
				<img src="https://redeye.sleezzi.fr/favicon.ico" alt="Home" />
				<h2>RedEye</h2>
			</Link>
			<button id={styles.disconnect} onClick={() => {
					localStorage.setItem("auth", JSON.stringify({ expireAt: 0 }));
					window.location.reload();
				}}>
					<div>Disconnect</div>
					<span className="material-symbols-outlined">logout</span>
			</button>
		</header>
		<div className={styles.margin}></div>
	</>);
}
export default Header;