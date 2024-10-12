import { Link } from "react-router-dom";
import styles from "../cdn/css/login.module.css";
function Login() {
	const params = new URLSearchParams(window.location.hash.substring(1));
	
	if (
		params.get("token_type") &&
		params.get("access_token") &&
		params.get("expires_in")
	) {
		localStorage.setItem("auth", JSON.stringify({
			token: `${params.get("token_type")} ${params.get("access_token")}`,
			expireAt: Math.floor(Date.now() / 1000 + Number(params.get("expires_in")))
		}));
		window.location.href = "/#/";
		window.location.reload();
	}
	return (<div className={styles.root}>
		<h2>You must be logged in to go further</h2>
		<h3>To access the dashboard you must connect to Discord</h3>
		<Link className={styles.login} to={`/invite`}>Login</Link>
	</div>);
}
export default Login;