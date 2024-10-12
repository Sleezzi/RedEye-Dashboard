import React, { Dispatch, SetStateAction, startTransition, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/annoucements.module.css";
import Save from "../Save";
import Input from "../InputComponent";
import { AddImageCanvas, Auth, Guild, Notify, User } from "../../interfacies";

const properties = {
	image: {
		width: 712,
		height: 400,
		background: "https://redeye.sleezzi.fr/cdn/img/canvas-background-welcome.png"
	},
	overlay: {
		get x() {
			return properties.overlay.margin;
		},
		get y() {
			return properties.overlay.margin;
		},
		get width() {
			return properties.image.width - properties.overlay.margin * 2;
		},	   
		get height() {
			return properties.image.height - properties.overlay.margin * 2;
		},
		color: "#00000050",
		margin: 15
	},
	pdp: {
		background: {
			get x() {
				return properties.image.width / 2
			},
			get y() {
				return properties.image.height / 3
			},
			size: 100
		},
		image: {
			get x() {
				return properties.pdp.background.x - properties.pdp.image.size
			},
			get y() {
				return properties.pdp.background.y - properties.pdp.image.size
			},
			get size() {
				return properties.pdp.background.size - 4
			}
		}
		
	},
	username: {
		get x() {
			return properties.image.width / 2
		},
		get y() {
			return properties.image.height / 3 + properties.pdp.background.size + properties.username.size
		},
		size: 64,
		get lineWidth() {
			return Math.floor(properties.username.size / 20)
		},
	},
	welcome: {
		get x() {
			return properties.image.width / 2
		},
		get y() {
			return properties.username.y + properties.welcome.size
		},
		size: 35,
		get lineWidth() {
			return Math.floor(properties.welcome.size / 20)
		},
	},
	pdpBot: {
		get x() {
			return properties.image.width - properties.pdpBot.size / 2 - 7
		},
		get y() {
			return properties.image.height - properties.pdpBot.size / 2 - 7
		},
		size: 50
	}
}
function Join({ auth, notify }: { auth: Auth, notify: Notify }) {
	const { guild, setGuild, user }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [join, setJoin] = useState<Guild["modules"]["join"]>(guild.modules.join);
	
	useEffect(() => setJoin(guild.modules.join), [guild.modules.join]);
	
	const save = async () => {
		const response = await fetch(`http://localhost:20659/modules/join?id=${guild.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth.token
			},
			body: JSON.stringify(join)
		});
		if (response.status === 200) {
			const modules = {...guild.modules};
			modules.join = join;
			setGuild((oldGuild: any) => ({...oldGuild,
				modules: modules
			}));
			return "Success";
		}
		notify("Error", "An error occurred while saving. If the error persists, contact support", 5);
		return "Error";
	}
	useEffect(() => {
		if (!user.avatar) return;
		(async () => {
			const canvas: HTMLCanvasElement | null = document.querySelector(`canvas#join:not(.${styles.loading})`);
			if (!canvas) return;
			canvas.className = styles.loading;
			canvas.height = properties.image.height;
			canvas.width = properties.image.width;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			const background = await (new AddImageCanvas(join && join.background && /^https?:\/\/+[a-zA-Z0-9\-\.]+\.+[\w]{2,4}\//.test(join.background) ? join.background : properties.image.background).img());
			ctx.drawImage(background, 0, 0, properties.image.width, properties.image.height);

			ctx.fillStyle = properties.overlay.color || "#FFF"; // Make the text white
			ctx.fillRect(properties.overlay.x || 0, properties.overlay.y || 0, properties.overlay.width || 0, properties.overlay.height || 0);

			ctx.font = `${properties.username.size || 42}px "Protest Strike"`; // Change the text font
			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = properties.username.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText(user.username, properties.username.x || 0, properties.username.y || 0); // Write the member's name
			ctx.strokeText(user.username, properties.username.x || 0, properties.username.y || 0);

			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.font = `35px "Protest Strike"`; // Change the text font
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = properties.welcome.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText(join && join.message ? join.message?.replace(/\$user/g, user.username).replace(/\$server/g, guild.name) : `Welcome!`, properties.welcome.x || 0, properties.welcome.y || 0); // Writes the member level
			ctx.strokeText(join && join.message ? join.message?.replace(/\$user/g, user.username).replace(/\$server/g, guild.name) : `Welcome!`, properties.welcome.x || 0, properties.welcome.y || 0);
			
			ctx.beginPath();
			ctx.save(); // Save the image
			ctx.arc(properties.pdpBot.x || 0, properties.pdpBot.y || 0, properties.pdpBot.size / 2 + properties.overlay.margin / 1.25, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(background, 0, 0, properties.image.width, properties.image.height); // Draw the background image
			ctx.restore(); // Restore the sheet
			ctx.closePath();

			ctx.beginPath(); // Create a new path
			ctx.arc(properties.pdpBot.x || 0, properties.pdpBot.y || 0, properties.pdpBot.size / 2, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.drawImage(await (new AddImageCanvas("/favicon.ico").img()), properties.pdpBot.x - properties.pdpBot.size / 2, properties.pdpBot.y - properties.pdpBot.size / 2 || 0, properties.pdpBot.size || 0, properties.pdpBot.size || 0); // Draw the bot's profile picture
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path

			ctx.beginPath(); // Create a new path
			ctx.arc(properties.pdp.background.x || 0, properties.pdp.background.y || 0, properties.pdp.background.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.fillRect(properties.pdp.background.x - properties.pdp.background.size || 0, properties.pdp.background.y - properties.pdp.background.size || 0, properties.pdp.background.size * 2 || 0, properties.pdp.background.size * 2 || 0); // Fill the circle blank
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path

			ctx.beginPath(); // Create a new path
			ctx.arc(properties.pdp.background.x || 0, properties.pdp.background.y || 0, properties.pdp.image.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.closePath(); // Close last path
			ctx.drawImage(await (new AddImageCanvas(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`).img()), properties.pdp.image.x || 0, properties.pdp.image.y || 0, properties.pdp.image.size * 2 || 0, properties.pdp.image.size * 2 || 0); // Draw the member's profile picture
			canvas.className = "";
		})();
	}, [join.background, join.message, user]);
	
	return (
		<main className={styles.content}>
			<div className={styles.container}>
				<h2>Join</h2>
				<button onClick={() => {
					setJoin((mods: any) => ({...mods, join: mods.join ? undefined : guild.modules.join }));
				}} className={`switch ${join ? "active" : ""}`} />
			</div>
			<div className={styles.container}>
				<div className={styles.properties}>
					<select id="joinChannel" value={join ? join.channelId : "none"} onChange={(e) => {
						if (e.target.selectedOptions[0].value === "none") return;
						setJoin(j => ({...j, channelId: e.target.selectedOptions[0].value}));
					}}>
						{
							join ? <></> : <option value="none">Select a channel</option>
						}
						{
							guild.channels?.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)
						}
					</select>
					<Input maxLength={25} defaultValue={join ? join.message : ""} placeholder="Message" className={styles.input} onChange={(e) => {
						setJoin(j => ({...j, message: e.target.value}));
					}} />
					<Input placeholder="Background url" maxLength={100} defaultValue={join ? join.background : ""} onChange={(e) => {
						setJoin(j => ({...j, background: e.target.value || ""}));
					}} />
				</div>
				<canvas id="join" />
			</div>
			<Save comparator={JSON.stringify(guild.modules.join) !== JSON.stringify(join)} reset={() => setJoin(guild.modules.join)} save={save} />
		</main>
	);
}

export default Join;