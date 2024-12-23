import { Link } from "react-router-dom";
import styles from "../cdn/css/loading.module.css";

function Loading({ message, back, attributes }: { message?: string, back?: string, attributes?: {} }) {
	return (
		<div className={styles.msgContainer} {...attributes} >
			<div className={styles.loading}></div>
			<h2>Please wait...</h2>
			<h3>{message || "Please wait a few seconds"}</h3>
			<div className={styles.buttons}>
				<Link className={styles.back} to={back ? back : "/"}>Back</Link>
			</div>
		</div>
	);
}

export default Loading;