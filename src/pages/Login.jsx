function Login({ auth, setAuth }) {
	const params = new URLSearchParams(window.location.hash.substring(1));
	console.log(
		params.get("token_type"),
		params.get("access_token"),
		params.get("expires_in"));
	
	if (
		params.get("token_type") &&
		params.get("access_token") &&
		params.get("expires_in")
	) {
		console.log(Math.floor(Date.now() / 1000 + Number(params.get("expires_in"))));
		setAuth({
			token: `${params.get("token_type")} ${params.get("access_token")}`,
			expireAt: Math.floor(Date.now() / 1000 + Number(params.get("expires_in")))
		});
		window.location.href = "/#/";
		window.location.reload();
	} else {
		window.location.href = "https://discord.com/oauth2/authorize?client_id=1232706723148726373&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2F&integration_type=0&scope=guilds+identify";
	}
	return (<>
		Please wait...
	</>);
}
export default Login;