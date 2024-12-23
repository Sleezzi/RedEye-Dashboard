import React, { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../cdn/css/guild/rss.module.css";
import Save from "../../Save";
import { Client, Guild, User } from "../../../interfacies";
import Input from "../../InputComponent";

function RSS_YouTube({ token, client }: { token: string, client: Client }) {
	const { guild, setGuild, user }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [youtube, setYoutube] = useState(guild.rss && guild.rss.youtube ? guild.rss.youtube : {
		channelId: "",
		channelYT: "",
		message: ""
	});

	const save = async () => {
		try {
			const response = await fetch(`${client.url}/rss/youtube?id=${guild.id}&channelYT=${youtube?.channelYT}&channelId=${youtube?.channelId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: token
				},
				body: JSON.stringify(youtube?.message ? [youtube?.message] : [])
			});
			if (response.status === 200) {
				const rss = {...guild.rss};
				rss.youtube = youtube;
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
			<h2>RSS - YouTube</h2>
			<h4>Youtube Channel</h4>
			<Input maxLength={15} value={youtube.channelYT} placeholder="Enter the name of the channel" onChange={(e) => setYoutube(yt => ({...yt, channelYT: e.target.value}))} />
			<h4>Channel</h4>
			<select name="channelId" value={youtube?.channelId} onChange={(e) => {
				if (e.target.selectedOptions[0].value !== "none") {
					setYoutube((yt: any) => ({...yt, channelId: e.target.selectedOptions[0].value}));
					return;
				}
			}}>
				{youtube?.channelId ? <option value="none">None</option> : <option disabled value="none">None</option>}
				{
					guild.channels?.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => youtube.channelId === channel.id ? <option disabled key={channel.id} value={channel.id}>{channel.name}</option> : <option key={channel.id} value={channel.id}>{channel.name}</option>)
				}
			</select>
			<h4>Message</h4>
			<Input maxLength={100} value={youtube.message} onChange={(e) => setYoutube(yt => ({...yt, message: e.target.value}))} />
			<p className="small">
				The message can include
				<br />
				<i><b>$title</b> for video title</i>,
				<br />
				<i><b>$link</b> for video link</i>,
				<br />
				<i><b>$id</b> for video id</i>,
				<br />
				<i><b>$channel</b> for channel name</i>,
				<br />
				<i><b>$channelLink</b> for channel link</i>
			</p>
			<Save comparator={JSON.stringify(guild.rss && guild.rss.youtube ? guild.rss.youtube : {
				channelId: "",
				channelYT: "",
				message: ""
			}) !== JSON.stringify(youtube)} reset={() => setYoutube(guild.rss && guild.rss.youtube ? guild.rss.youtube : {
				channelId: "",
				channelYT: "",
				message: ""
			})} save={save} />
		</main>
	);
}

export default RSS_YouTube;