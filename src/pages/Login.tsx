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
		<a className={styles.login} href={`https://discord.com/oauth2/authorize?client_id=1195058289931726848&response_type=token&redirect_uri=${encodeURIComponent(window.location.origin)}&integration_type=0&scope=guilds+identify`}>Login</a>
	</div>);
}
export default Login;