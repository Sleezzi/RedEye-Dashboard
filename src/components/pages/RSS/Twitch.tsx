import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../cdn/css/guild/rss.module.css";
import Save from "../../Save";
import { Client, Guild, User } from "../../../interfacies";
import Input from "../../InputComponent";

function RSS_Twitch({ token, client }: { token: string, client: Client }) {
	const { guild, setGuild, user }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [twitch, setTwitch] = useState(guild.rss && guild.rss.twitch ? guild.rss.twitch : {
		channelId: "",
		channel: "",
		message: ""
	});
	console.log(guild);
	
	const [icon, setIcon] = useState<string | undefined>();

	useEffect(() => {
		if (twitch.channel.length < 2) {
			setIcon(undefined);
			return;
		}
		fetch(`https://decapi.me/twitch/avatar/${twitch.channel}`)
		.then(response => response.text())
		.then((response: string) => {
			if (/^https?/.test(response)) {
				setIcon(response);
			} else setIcon(undefined);
		});
	}, [twitch.channel]);
	
	const save = async () => {
		try {
			const response = await fetch(`${client.url}/rss/twitch?id=${guild.id}&channel=${twitch?.channel}&channelId=${twitch?.channelId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: token
				},
				body: JSON.stringify(twitch?.message ? [twitch?.message] : [])
			});
			if (response.status === 200) {
				const rss = {...guild.rss};
				rss.twitch = twitch;
				setGuild((oldGuild: any) => ({...oldGuild,
					rss: rss
				}));
				return "Success";
			}
			return "Error";
		} catch (error) {
			return "Error";
		}
	}
	return (
		<main className={styles.content}>
			<h2>RSS - Twitch</h2>
			<h4>Twitch Channel</h4>
			<div style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
				<Input className={styles.channel} maxLength={15} value={twitch.channel} placeholder="Enter the name of the channel" onChange={(e) => setTwitch(yt => ({...yt, channel: e.target.value.toLowerCase()}))} />
				<img className={styles.channelIcon} src={icon || "https://static-cdn.jtvnw.net/user-default-pictures-uv/13e5fa74-defa-11e9-809c-784f43822e80-profile_image-300x300.png"} alt="Channel icon" />
			</div>
			<h4>Channel</h4>
			<select name="channelId" value={twitch?.channelId} onChange={(e) => {
				if (e.target.selectedOptions[0].value !== "none") {
					setTwitch((yt: any) => ({...yt, channelId: e.target.selectedOptions[0].value}));
					return;
				}
			}}>
				{twitch?.channelId ? <option value="none">None</option> : <option disabled value="none">None</option>}
				{
					guild.channels?.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => twitch.channelId === channel.id ? <option disabled key={channel.id} value={channel.id}>{channel.name}</option> : <option key={channel.id} value={channel.id}>{channel.name}</option>)
				}
			</select>
			<h4>Message</h4>
			<Input maxLength={100} value={twitch.message?.replace(/\$channel/g, twitch.channel.length === 0 ? "$channel" : twitch.channel).replace(/\$link/g, twitch.channel.length === 0 ? "$link" : `https://twitch.tv/${twitch.channel}`)} onChange={(e) => {
				setTwitch(yt => ({...yt, message: e.target.value}));
			}} />
			<p className="small">
				The message can include
				<br />
				<i><b>$title</b> for stream title</i>,
				<br />
				<i><b>$channel</b> for channel name</i>,
				<br />
				<i><b>$link</b> for channel link</i>
			</p>
			<Save comparator={JSON.stringify(guild.rss && guild.rss.twitch ? guild.rss.twitch : {
				channelId: "",
				channel: "",
				message: ""
			}) !== JSON.stringify(twitch)} reset={() => setTwitch(guild.rss && guild.rss.twitch ? guild.rss.twitch : {
				channelId: "",
				channel: "",
				message: ""
			})} save={save} />
		</main>
	);
}

export default RSS_Twitch;