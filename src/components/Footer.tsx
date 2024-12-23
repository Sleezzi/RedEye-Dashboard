import { Link } from "react-router-dom";

import styles from "../cdn/css/footer.module.css";

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.company}>
					<h4>Bot</h4>
					<a target="_blank" href="https://redeye.sleezzi.fr/server">Support server</a>
					<a target="_blank" href="https://status-redeye.sleezzi.fr">Status</a>
					<a target="_blank" href="https://redeye.sleezzi.fr/docs">Docs</a>
				</div>
				<div className={styles.partners}>
					<h4>Powered by</h4>
					<a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node JS</a>
					<a href="https://discord.js.org" target="_blank" rel="noopener noreferrer">Discord.js</a>
					<a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">Express.js</a>
					<a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase</a>
					<a href="https://bot-hosting.net" target="_blank" rel="noopener noreferrer">Bot-Hosting</a>
					<a href="https://github.com/Sleezzi/RedEye" target="_blank" rel="noopener noreferrer">GitHub</a>
				</div>
				<div className={styles.contact}>
					<h4>Contacter Sleezzi Inc.</h4>
					<h5>Par E-Mail</h5>
					<a href="mailto:contact@sleezzi.fr" rel="noopener noreferrer">contact@sleezzi.fr</a>
				</div>
			</div>
			<div className={styles.right}>
				<h5>
					© 2024 RedEye All right reserved -
					<Link to="legals">Legal Notices</Link>
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