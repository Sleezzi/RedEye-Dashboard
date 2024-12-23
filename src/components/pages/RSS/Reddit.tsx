import React, { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../cdn/css/guild/rss.module.css";
import Save from "../../Save";
import { Client, Guild, User } from "../../../interfacies";
import Input from "../../InputComponent";

function RSS_Reddit({ token, client }: { token: string, client: Client }) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>> } = useOutletContext();
	const [reddit, setReddit] = useState(guild.rss && guild.rss.reddit ? guild.rss.reddit : {
		channelId: "",
		subreddit: "",
		message: ""
	});

	const save = async () => {
		try {
			const response = await fetch(`${client.url}/rss/reddit?id=${guild.id}&subreddit=${reddit?.subreddit}&channelId=${reddit?.channelId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: token
				},
				body: JSON.stringify(reddit?.message ? [reddit?.message.replaceAll(reddit.subreddit, "$subreddit")] : [])
			});
			if (response.status === 200) {
				const rss = {...guild.rss};
				rss.reddit = reddit;
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
			<h2>RSS - Reddit</h2>
			<h4>Subreddit</h4>
			<Input maxLength={15} value={reddit.subreddit} placeholder="Enter the name of the subreddit" onChange={(e) => setReddit(yt => ({...yt, subreddit: e.target.value}))} />
			<h4>Channel</h4>
			<select name="channelId" value={reddit?.channelId} onChange={(e) => {
				if (e.target.selectedOptions[0].value !== "none") {
					setReddit((yt: any) => ({...yt, channelId: e.target.selectedOptions[0].value}));
					return;
				}
			}}>
				{reddit?.channelId ? <option value="none">None</option> : <option disabled value="none">None</option>}
				{
					guild.channels?.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => reddit.channelId === channel.id ? <option disabled key={channel.id} value={channel.id}>{channel.name}</option> : <option key={channel.id} value={channel.id}>{channel.name}</option>)
				}
			</select>
			<h4>Message</h4>
			<Input maxLength={100} value={reddit.message} onChange={(e) => setReddit(yt => ({...yt, message: e.target.value.replace(/\$subreddit/g, reddit.subreddit || "$subreddit")}))} />
			<p className="small">
				The message can include
				<br />
				<i><b>$title</b> for post title</i>,
				<br />
				<i><b>$link</b> for post link</i>,
				<br />
				<i><b>$id</b> for post id</i>,
				<br />
				<i><b>$subreddit</b> for subreddit name</i>,
				<br />
				<i><b>$subredditLink</b> for subreddit name</i>
			</p>
			<Save comparator={JSON.stringify(guild.rss && guild.rss.reddit ? guild.rss.reddit : {
				channelId: "",
				subreddit: "",
				message: ""
			}) !== JSON.stringify(reddit)} reset={() => setReddit(guild.rss && guild.rss.reddit ? guild.rss.reddit : {
				channelId: "",
				subreddit: "",
				message: ""
			})} save={save} />
		</main>
	);
}

export default RSS_Reddit;