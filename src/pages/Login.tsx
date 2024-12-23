import { Link } from "react-router-dom";
import styles from "../cdn/css/login.module.css";
import { getCookie } from "../interfacies";
function Login() {
	document.cookie = "cookieAllowed=true; max-age=5; path=/";
	if (!getCookie("cookieAllowed")) return (<div className={styles.root}>
		<span style={{fontSize: "5rem"}} className="material-symbols-outlined">cookie</span>
		<h2>This site requires cookies to function properly.</h2>
		<h3>This site uses cookies only to authenticate you, this data is not shared with third party sites other than sleezzi.fr</h3>
		<button onClick={() => window.location.reload()}>Refresh the page</button>
	</div>);
	
	const params = new URLSearchParams(window.location.hash.substring(1));
	
	if (
		params.get("token_type") &&
		params.get("access_token") &&
		params.get("expires_in")
	) {
		document.cookie = `token=${params.get("token_type")} ${params.get("access_token")}; expires=${new Date(Date.now() + Number(params.get("expires_in")) * 1000).toUTCString()}; domain=localhost`;
		document.cookie = `token=${params.get("token_type")} ${params.get("access_token")}; expires=${new Date(Date.now() + Number(params.get("expires_in")) * 1000).toUTCString()}; domain=sleezzi.fr; secure;`;
		window.location.href = "/"
	}
	return (<div className={styles.root}>
		<span style={{fontSize: "5rem"}} className="material-symbols-outlined">passkey</span>
		<h2>You must be logged in to go further</h2>
		<h3>To access the dashboard you must connect to Discord</h3>
		<Link className={styles.login} to={"invite"}>Login</Link>
		<h4 className={styles.cookie}><span style={{fontSize: "100%"}} className="material-symbols-outlined">cookie</span> By clicking on "Login", you agree to this site using cookies to authenticate you.</h4>
	</div>);
}
export default Login;