import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/moderation.module.css";
import Save from "../Save";
import Input from "../InputComponent";
import { Auth, Guild, Notify } from "../../interfacies";

function Moderation({ auth, notify }: { auth: Auth, notify: Notify }) {
	const { guild, setGuild }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>> } = useOutletContext();
	const [automod, setAutomod] = useState<Guild["modules"]["automod"]>(guild.modules.automod);
	const [blockLink, setBlockLink] = useState<Guild["modules"]["link"]>(guild.modules.link);
	
	const save = async () => {
		try {
			const response = await fetch(`http://localhost:20659/modules/moderation?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth.token
				},
				body: JSON.stringify({
					automod,
					link: blockLink
				})
			});
			if (response.status === 200) {
				const modules = {...guild.modules};
				modules.automod = automod as any;
				modules.link = blockLink;
				setGuild((oldGuild: any) => ({...oldGuild, modules }));
				return "Success";
			}
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		} catch (error) {
			notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
			return "Error";
		}
	}
	return (
		<main className={styles.content}>
			<h2>Moderation</h2>
			<section id="defaultList">
				<span className="material-symbols-outlined">block</span>
				<div className={styles.container}>
					<h3>Automod - Default List</h3>
					<p>When a message is sent and it contains a banned word the message is deleted and sent back in a censored version.</p>
				</div>

				<button onClick={() => setAutomod((a: any) => ({...a, defaultList: a?.defaultList ? !a.defaultList : true}))} className={`switch ${automod && automod.defaultList ? "active" : ""}`} />
			</section>
			<section id="customList">
				<div className={styles.container}>
					<h3>Automod - Custom List :</h3>
					<p>When a message is sent and it contains a banned word the message is deleted and sent back in a censored version.</p>
				</div>
				<div className={styles.container}>
					<div className={styles.custom_words_list}>{
						automod && automod.words && automod.words.length > 0 ?
						automod.words.map((word, index) => (<button key={index} onClick={(e) => {
							const newWords = [...automod.words || []];
							newWords.splice(index, 1);
							setAutomod((a: any) => ({...a, words: newWords}));
						}}>{word}</button>)) : <></>
					}</div>
					<div style={{display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%"}}>
						<Input className={styles.input} placeholder="Enter a word/regex to block" maxLength={75} />
						<button className={styles.addWord} onClick={() => {
							const input = document.querySelector(`.${styles.input} > textarea`) as HTMLTextAreaElement;
							if (!input) return;
							if (input.value.length === 0) return;
							const newWords = [...automod?.words || []];
							newWords.push(input.value);
							setAutomod((a: any) => ({...a, words: newWords}));
							input.value = "";
						}} >Add a word</button>
					</div>
				</div>
			</section>
			<section id="blockLink">
				<span className="material-symbols-outlined">link_off</span>
				<div className={styles.container}>
					<h3>Block link</h3>
					<p>When a message is sent and it contains a link the message is deleted and resent without the link</p>
				</div>

				<button onClick={() => setBlockLink((link: any) => ({...link, active: link?.active ? !link.active : true}))} className={`switch ${blockLink && blockLink.active ? "active" : ""}`} />
			</section>
			<Save comparator={JSON.stringify(guild.modules.automod) !== JSON.stringify(automod) || JSON.stringify(guild.modules.link) !== JSON.stringify(blockLink)} reset={() => {
				setAutomod(guild.modules.automod);
				setBlockLink(guild.modules.link);
			}} save={save} />
		</main>
	);
}

export default Moderation;