import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild.moderation.module.css";
import Save from "../Save";

function Moderation({ auth }) {
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
		const response = await fetch(`http://48530.site.bot-hosting.net/modules?id=${guild.id}`, {
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
		} else return "Error";
	}
	return (
		<main className={styles.content}>
			<h2>Moderation</h2>
			<section id="defaultList">
				<span className="material-symbols-outlined">block</span>
				<div className={styles.container}>
					<h3>Automod - Default List</h3>
					<p>Lorsqu'un message est envoyé et qu'il contient un mot banni le message est supprimé et renvoyé en version censurée</p>
				</div>

				<button onClick={() => setModules(mods => ({...mods, automod: {
						defaultList: !mods.automod.defaultList,
						words: mods.automod.words,
						ignore: mods.automod.ignore
					}
				}))} className={`switch ${modules.automod && modules.automod.defaultList ? "active" : ""}`} />
			</section>
			<section id="customList">
				<div className={styles.container}>
					<h3>Automod - Custom List :</h3>
					<p>Lorsqu'un message est envoyé et qu'il contient un mot banni le message est supprimé et renvoyé en version censurée</p>
				</div>
				<div className={styles.container}>
					<div className={styles.custom_words_list}>{
						!modules.automod || !modules.automod.words ?
						<></> :
						modules.automod.words.map((word, index) => (<button key={index} onClick={(e) => {
							const newWords = [...modules.automod.words];
							newWords.splice(index, 1);
							setModules(mods => ({...mods, automod: {
									defaultList: mods.automod.defaultList,
									words: newWords,
									ignore: mods.automod.ignore
								}
							}));
						}}>{word}</button>))
					}</div>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
						<input className={styles.input} type="text" placeholder="Entrer un mot/regex à bloquer" />
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
						}} >Ajouter un mot</button>
					</div>
				</div>
			</section>
			<section id="blockLink">
				<span className="material-symbols-outlined">link_off</span>
				<div className={styles.container}>
					<h3>Block link</h3>
					<p>Lorsqu'un message est envoyé et qu'il contient un link le message est supprimé et renvoyé sans le lien</p>
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