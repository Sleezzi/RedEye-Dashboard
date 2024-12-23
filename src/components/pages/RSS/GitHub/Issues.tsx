import React, { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../../cdn/css/guild/rss.module.css";
import Save from "../../../Save";
import { Client, Guild, User } from "../../../../interfacies";
import Input from "../../../InputComponent";

function RSS_GitHub_Issues({ token, client }: { token: string, client: Client }) {
	const { guild, setGuild, user }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [github, setGitHub] = useState(guild.rss && guild.rss.github && guild.rss.github.issues ? guild.rss.github.issues : {
		channelId: "",
		repo: "",
		user: ""
	});

	const save = async () => {
		try {
			const response = await fetch(`${client.url}/rss/github/issues?id=${guild.id}&repo=${github?.repo}&user=${github.user}&channelId=${github?.channelId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: token
				},
				body: JSON.stringify(github?.message ? [github?.message.replaceAll(github.user, "$owner").replaceAll(github.repo.toUpperCase(), "$repo")] : [])
			});
			
			if (response.status === 200) {
				const rss = {...guild.rss};
				rss.github.issues = github;
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
			<h2>RSS - GitHub</h2>
			<h4>User</h4>
			<Input maxLength={15} value={github.user} placeholder="Enter the name of the user" onChange={(e) => setGitHub(g => ({...g, user: e.target.value}))} />
			<h4>Repo</h4>
			<Input maxLength={15} value={github.repo} placeholder="Enter the name of the repo" onChange={(e) => setGitHub(g => ({...g, repo: e.target.value}))} />
			<h4>Channel</h4>
			<select name="channelId" value={github?.channelId} onChange={(e) => {
				if (e.target.selectedOptions[0].value !== "none") {
					setGitHub((g: any) => ({...g, channelId: e.target.selectedOptions[0].value}));
					return;
				}
			}}>
				{github?.channelId ? <option value="none">None</option> : <option disabled value="none">None</option>}
				{
					guild.channels?.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => github.channelId === channel.id ? <option disabled key={channel.id} value={channel.id}>{channel.name}</option> : <option key={channel.id} value={channel.id}>{channel.name}</option>)
				}
			</select>
			<h4>Message</h4>
			<Input maxLength={100} value={github.message?.replace(/\$owner/g, github.user).replace(/\$repo/g, github.repo.toUpperCase())} onChange={(e) => setGitHub(g => ({...g, message: e.target.value}))} />
			<p className="small">
				The message can include
				<br />
				<i><b>$title</b> for video title</i>,
				<br />
				<i><b>$link</b> for issue link</i>,
				<br />
				<i><b>$id</b> for issue id</i>,
				<br />
				<i><b>$tokenor</b> For the name of the person who reported the issue</i>,
				<br />
				<i><b>$owner</b> for the owner name of the repository</i>
				<br />
				<i><b>$repo</b> for repository name</i>
			</p>
			<Save comparator={JSON.stringify(guild.rss && guild.rss.github && guild.rss.github.issues ? guild.rss.github.issues : {
				channelId: "",
				repo: "",
				user: ""
			}) !== JSON.stringify(github)} reset={() => setGitHub(guild.rss && guild.rss.github && guild.rss.github.issues ? guild.rss.github.issues : {
				channelId: "",
				repo: "",
				user: ""
			})} save={save} />
		</main>
	);
}

export default RSS_GitHub_Issues;