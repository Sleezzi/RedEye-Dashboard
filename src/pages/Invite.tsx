import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Client } from "../interfacies";

function Invite({ client }: {client: Client}) {
	const params = useParams();
	
	if (params.guild) {
		window.location.href = `https://discord.com/oauth2/authorize?client_id=${client.id}&permissions=1153933091732599&response_type=token&redirect_uri=${encodeURIComponent(window.location.origin)}&integration_type=0&scope=guilds&guild_id=${params.guild}`;
	} else {
		window.location.href = `https://discord.com/oauth2/authorize?client_id=${client.id}&response_type=token&redirect_uri=${encodeURIComponent(window.location.origin)}&integration_type=0&scope=guilds+identify`;
	}
	return (<Loading message="You will be redirected to Discord"/>);
}

export default Invite;