import { Link } from "react-router-dom";

import styles from "../cdn/css/footer.module.css";

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.company}>
					<h4>Bot</h4>
					<a target="_blank" href="https://redeye.sleezzi.fr">A propos</a>
					<a target="_blank" href="https://status-redeye.sleezzi.fr">Status</a>
					<a target="_blank" href="https://redeye.sleezzi.fr/docs">Docs</a>
				</div>
				<div className={styles.partners}>
					<h4>Powered by</h4>
					<a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node JS</a>
					<a href="https://discord.js.org" target="_blank" rel="noopener noreferrer">Discord.js</a>
					<a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase</a>
					<a href="https://flowhardware.ch" target="_blank" rel="noopener noreferrer">Flowhardware</a>
					<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
				</div>
				<div className={styles.contact}>
					<h4>Contacter Sleezzi Inc</h4>
					<h5>Par E-Mail</h5>
					<a href="mailto:contact@sleezzi.fr" target="_blank" rel="noopener noreferrer">contact@sleezzi.fr</a>
				</div>
			</div>
			<div className={styles.right}>
				<h5>
					© 2024 RedEye Tous droits réservés -
					<Link to="legals">Mentions Légales</Link>
					- Réalisation
					<a href="https://sleezzi.fr" target="_blank" rel="noopener noreferrer">
						Sleezzi Inc
					</a>
				</h5>
			</div>
		</footer>
	);
}
export default Footer;