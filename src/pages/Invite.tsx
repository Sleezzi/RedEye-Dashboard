import { useParams } from "react-router-dom";

function Invite() {
	const params = useParams();
	
	
	if (
		params.guild
	) {
		window.location.href = `https://discord.com/oauth2/authorize?client_id=1195058289931726848&permissions=1153933091732599&response_type=token&redirect_uri=${encodeURIComponent(window.location.origin)}&integration_type=0&scope=identify+bot&guild_id=${params.guild}`;
	} else {
		window.location.href = `https://discord.com/oauth2/authorize?client_id=1195058289931726848&response_type=token&redirect_uri=${encodeURIComponent(window.location.origin)}&integration_type=0&scope=guilds+identify`;
	}
	return (
		<>
			Please wait...
		</>
	);
}

export default Invite;