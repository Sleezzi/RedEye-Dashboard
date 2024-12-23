import styles from "../../cdn/css/guild/rss.module.css";
import { Link } from "react-router-dom";

function RSS() {
	return (
		<main className={styles.content}>
			<h2>RSS</h2>
			<div className={styles.container}>
				<Link to="youtube">
					<img src="/cdn/img/icon/youtube.png" alt="YouTube Icon" />
					<h2>YouTube</h2>
					<h5>Send a message when a video is released on a YouTube channel</h5>
				</Link>
				<Link to="twitch">
					<img src="/cdn/img/icon/twitch.png" alt="Twitch Icon" />
					<h2>Twitch</h2>
					<h5>Send a message when your channel goes live</h5>
				</Link>
				<Link to="reddit">
					<img src="/cdn/img/icon/reddit.png" alt="Reddit Icon" />
					<h2>Reddit</h2>
					<h5>Send a message when a message is posted on a subreddit</h5>
				</Link>
				<Link to="github">
					<img src="/cdn/img/icon/github.png" alt="Github Icon" />
					<h2>Github</h2>
					<h5>Send a message when a user report an issues</h5>
				</Link>
			</div>
		</main>
	);
}

export default RSS;