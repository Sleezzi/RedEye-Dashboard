import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild.moderation.module.css";
import Save from "../Save";

function Moderation({ auth, notify }) {
	const { guild, setGuild } = useOutletContext();
	const [modules, setModules] = useState(guild.modules || {
		automod: {
			defaultList: true,
			words: []
		},
		link: {
			active: true
		}
	});
	
	useEffect(() => setModules(guild.modules), [guild.modules]);
	
	const save = async () => {
		try {
			const response = await fetch(`https://api-redeye.sleezzi.fr/modules?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth.token
				},
				body: JSON.stringify(modules)
			});
			if (response.status === 200) {
				setGuild(oldGuild => ({...oldGuild,
					modules: modules
				}));
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

				<button onClick={() => setModules(mods => ({...mods, automod: mods.automod ? {
						defaultList: !mods.automod.defaultList,
						words: mods.automod.words,
						ignore: mods.automod.ignore
					} : {
						defaultList: true,
						words: []
					}
				}))} className={`switch ${modules.automod && modules.automod.defaultList ? "active" : ""}`} />
			</section>
			<section id="customList">
				<div className={styles.container}>
					<h3>Automod - Custom List :</h3>
					<p>When a message is sent and it contains a banned word the message is deleted and sent back in a censored version.</p>
				</div>
				<div className={styles.container}>
					<div className={styles.custom_words_list}>{
						!modules.automod || !modules.automod.words ?
						<></> :
						modules.automod.words.map((word, index) => (<button key={index} onClick={(e) => {
							const newWords = [...modules.automod.words];
							newWords.splice(index, 1);
							setModules(mods => ({...mods, automod: mods.automod ? {
									defaultList: mods.automod.defaultList,
									words: newWords,
									ignore: mods.automod.ignore
								} : {
									defaultList: false,
									words: newWords
								}
							}));
						}}>{word}</button>))
					}</div>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
						<input className={styles.input} type="text" placeholder="Enter a word/regex to block" />
						<button className={styles.addWord} onClick={() => {
							if (document.querySelector(`.${styles.input}`).value.length === 0) return;
							const newWords = [...modules.automod.words];
							newWords.push(document.querySelector(`.${styles.input}`).value);
							setModules(mods => ({...mods, automod: {
								defaultList: mods.automod.defaultList,
								words: newWords,
								ignore: mods.automod.ignore
							}}));
							document.querySelector(`.${styles.input}`).value = "";
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

				<button onClick={() => setModules(mods => ({...mods, link: mods.link ? {
						active: !mods.link.active,
						ignore: mods.link.ignore
					} : {
						active: true
					}
				}))} className={`switch ${modules.link && modules.link.active ? "active" : ""}`} />
			</section>
			<Save comparator={JSON.stringify(guild.modules) !== JSON.stringify(modules)} reset={() => setModules(guild.modules)} save={save} />
		</main>
	);
}

export default Moderation;