import { Link } from "react-router-dom";

import styles from "../cdn/css/header.module.css";
import { useEffect } from "react";

function Header({ sidenav, setSidenav }: { sidenav?: boolean, setSidenav?: React.Dispatch<React.SetStateAction<boolean>> }) {
	useEffect(() => {
		if (!document.querySelector(`#${styles.sidenav}`)) return;
		(document.querySelector(`#${styles.sidenav}`) as any).className = sidenav ? styles.active : "";
	}, [sidenav]);
	return (<>
		<header className={styles.header}>
			{
				sidenav === undefined || setSidenav === undefined ? <></> :
				<button id={styles.sidenav} onClick={() =>setSidenav(!sidenav)}>
					<span></span>
					<span></span>
					<span></span>
				</button>
			}
			<Link to="/">
				<img src="https://redeye.sleezzi.fr/favicon.ico" alt="Home" />
				<h2>RedEye</h2>
			</Link>
			<button id={styles.disconnect} onClick={() => {
					localStorage.setItem("auth", JSON.stringify({ expireAt: 0 }));
					window.location.reload();
				}}>
					<span className="material-symbols-outlined">logout</span>
			</button>
		</header>
		<div className={styles.margin}></div>
	</>);
}
export default Header;