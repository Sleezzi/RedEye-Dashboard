import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild.annoucements.module.css";
import Save from "../Save";

const join = {
	image: {
		width: 712,
		height: 400,
		background: "https://redeye.sleezzi.fr/cdn/img/canvas-background-welcome.png"
	},
	overlay: {
		get x() {
			return join.overlay.margin;
		},
		get y() {
			return join.overlay.margin;
		},
		get width() {
			return join.image.width - join.overlay.margin * 2;
		},	   
		get height() {
			return join.image.height - join.overlay.margin * 2;
		},
		color: "#00000050",
		margin: 15
	},
	pdp: {
		background: {
			get x() {
				return join.image.width / 2
			},
			get y() {
				return join.image.height / 3
			},
			size: 100
		},
		image: {
			get x() {
				return join.pdp.background.x - join.pdp.image.size
			},
			get y() {
				return join.pdp.background.y - join.pdp.image.size
			},
			get size() {
				return join.pdp.background.size - 4
			}
		}
		
	},
	username: {
		get x() {
			return join.image.width / 2
		},
		get y() {
			return join.image.height / 3 + join.pdp.background.size + join.username.size
		},
		size: 64,
		get lineWidth() {
			return Math.floor(join.username.size / 20)
		},
	},
	welcome: {
		get x() {
			return join.image.width / 2
		},
		get y() {
			return join.username.y + join.welcome.size
		},
		size: 35,
		get lineWidth() {
			return Math.floor(join.welcome.size / 20)
		},
	},
	pdpBot: {
		get x() {
			return join.image.width - join.pdpBot.size / 2 - 7
		},
		get y() {
			return join.image.height - join.pdpBot.size / 2 - 7
		},
		size: 50
	}
}
const leave = {
	image: {
		width: 712,
		height: 400,
		background: "https://redeye.sleezzi.fr/cdn/img/canvas-background-goodbye.png"
	},
	overlay: {
		get x() {
			return leave.overlay.margin;
		},
		get y() {
			return leave.overlay.margin;
		},
		get width() {
			return leave.image.width - leave.overlay.margin * 2;
		},
		get height() {
			return leave.image.height - leave.overlay.margin * 2;
		},
		color: "#00000050",
		margin: 15
	},
	pdp: {
		background: {
			get x() {
				return leave.image.width / 2
			},
			get y() {
				return leave.image.height / 3
			},
			size: 100
		},
		image: {
			get x() {
				return leave.pdp.background.x - leave.pdp.image.size
			},
			get y() {
				return leave.pdp.background.y - leave.pdp.image.size
			},
			get size() {
				return leave.pdp.background.size - 4
			}
		}
		
	},
	username: {
		get x() {
			return leave.image.width / 2
		},
		get y() {
			return leave.image.height / 3 + leave.pdp.background.size + leave.username.size
		},
		size: 64,
		get lineWidth() {
			return Math.floor(leave.username.size / 20)
		},
	},
	goodbye: {
		get x() {
			return leave.image.width / 2
		},
		get y() {
			return leave.username.y + leave.goodbye.size
		},
		size: 35,
		get lineWidth() {
			return Math.floor(leave.goodbye.size / 20)
		},
	},
	pdpBot: {
		get x() {
			return leave.image.width - leave.pdpBot.size / 2 - 7
		},
		get y() {
			return leave.image.height - leave.pdpBot.size / 2 - 7
		},
		size: 50
	}
}

function Annoucements({ auth }) {
	const { guild, setGuild } = useOutletContext();
	const [modules, setModules] = useState(guild.modules || {
		join: {
			channelId: "",
			message: "",
			background: ""
		},
		leave: {
			channelId: "",
			message: "",
			background: ""
		}
	});
	const [channels, setChannels] = useState([{ id: "0", name: "Please wait...", type: 0, permissions: 0 }]);
	const addImage = async (url) => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = url;
		});
	}
	
	useEffect(() => setModules(guild.modules), [guild.modules]);
	useEffect(() => guild.channels ? setChannels(guild.channels) : undefined, [guild.channels]);
	
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
	useEffect(() => {
		(async () => {
			const canvas = document.querySelector("canvas#join");
			canvas.height = join.image.height;
			canvas.width = join.image.width;
			const ctx = canvas.getContext("2d");
			const background = await addImage(modules.join && /^https?:\/\/+[a-zA-Z0-9\-\.]+\.+[\w]{2,4}\//.test(modules.join.background) ? modules.join.background : join.image.background);
			ctx.drawImage(background, 0, 0, join.image.width, join.image.height);

			ctx.fillStyle = join.overlay.color || "#FFF"; // Make the text white
			ctx.fillRect(join.overlay.x || 0, join.overlay.y || 0, join.overlay.width || 0, join.overlay.height || 0);

			ctx.font = `${join.username.size || 42}px "Protest Strike"`; // Change the text font
			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = join.username.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText("REDEYE", join.username.x || 0, join.username.y || 0); // Write the member's name
			ctx.strokeText("REDEYE", join.username.x || 0, join.username.y || 0);

			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.font = `35px "Protest Strike"`; // Change the text font
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = join.welcome.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText(modules.join && modules.join.message ? modules.join.message?.replace(/\$user/g, "REDEYE").replace(/\$server/g, guild.name) : `Welcome!`, join.welcome.x || 0, join.welcome.y || 0); // Writes the member level
			ctx.strokeText(modules.join && modules.join.message ? modules.join.message?.replace(/\$user/g, "REDEYE").replace(/\$server/g, guild.name) : `Welcome!`, join.welcome.x || 0, join.welcome.y || 0);
			
			ctx.beginPath();
			ctx.save(); // Save the image
			ctx.arc(join.pdpBot.x || 0, join.pdpBot.y || 0, join.pdpBot.size / 2 + join.overlay.margin / 1.25, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(background, 0, 0, join.image.width, join.image.height); // Draw the background image
			ctx.closePath();

			ctx.beginPath(); // Create a new path
			const pdpbot = await addImage("/favicon.ico"); // Load the bot's profile image
			ctx.arc(join.pdpBot.x || 0, join.pdpBot.y || 0, join.pdpBot.size / 2, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.drawImage(pdpbot, join.pdpBot.x - join.pdpBot.size / 2, join.pdpBot.y - join.pdpBot.size / 2 || 0, join.pdpBot.size || 0, join.pdpBot.size || 0); // Draw the bot's profile picture
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path

			ctx.beginPath(); // Create a new path
			ctx.arc(join.pdp.background.x || 0, join.pdp.background.y || 0, join.pdp.background.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.fillRect(join.pdp.background.x - join.pdp.background.size || 0, join.pdp.background.y - join.pdp.background.size || 0, join.pdp.background.size * 2 || 0, join.pdp.background.size * 2 || 0); // Fill the circle blank
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path

			ctx.beginPath(); // Create a new path
			const pdp = await addImage("/favicon.ico");
			ctx.arc(join.pdp.background.x || 0, join.pdp.background.y || 0, join.pdp.image.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.closePath(); // Close last path
			ctx.drawImage(pdp, join.pdp.image.x || 0, join.pdp.image.y || 0, join.pdp.image.size * 2 || 0, join.pdp.image.size * 2 || 0); // Draw the member's profile picture
		})();
	}, [modules.join]);
	
	useEffect(() => {
		(async () => {
			const canvas = document.querySelector("canvas#leave");
			canvas.height = leave.image.height;
			canvas.width = leave.image.width;
			const ctx = canvas.getContext("2d");
			const background = await addImage(modules.leave && /^https?:\/\/+[a-zA-Z0-9\-\.]+\.+[\w]{2,4}\//.test(modules.leave.background) ? modules.leave.background : leave.image.background);
			ctx.drawImage(background, 0, 0, leave.image.width, leave.image.height);

			ctx.fillStyle = leave.overlay.color || "#FFF"; // Make the text white
			ctx.fillRect(leave.overlay.x || 0, leave.overlay.y || 0, leave.overlay.width || 0, leave.overlay.height || 0);

			ctx.font = `${leave.username.size || 42}px "Protest Strike"`; // Change the text font
			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = leave.username.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText("REDEYE", leave.username.x || 0, leave.username.y || 0); // Write the member's name
			ctx.strokeText("REDEYE", leave.username.x || 0, leave.username.y || 0);

			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.font = `35px "Protest Strike"`; // Change the text font
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = leave.goodbye.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText(modules.leave && modules.leave.message ? modules.leave.message?.replace(/\$user/g, "REDEYE").replace(/\$server/g, guild.name) : `Goodbye!`, leave.goodbye.x || 0, leave.goodbye.y || 0); // Writes the member level
			ctx.strokeText(modules.leave && modules.leave.message ? modules.leave.message?.replace(/\$user/g, "REDEYE").replace(/\$server/g, guild.name) : `Goodbye!`, leave.goodbye.x || 0, leave.goodbye.y || 0);
			
			ctx.beginPath();
			ctx.save(); // Save the image
			ctx.arc(leave.pdpBot.x || 0, join.pdpBot.y || 0, leave.pdpBot.size / 2 + leave.overlay.margin / 1.25, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(background, 0, 0, leave.image.width, leave.image.height); // Draw the background image
			ctx.closePath();

			ctx.beginPath(); // Create a new path
			const pdpbot = await addImage("/favicon.ico"); // Load the bot's profile image
			ctx.arc(leave.pdpBot.x || 0, leave.pdpBot.y || 0, leave.pdpBot.size / 2, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.drawImage(pdpbot, leave.pdpBot.x - leave.pdpBot.size / 2, leave.pdpBot.y - leave.pdpBot.size / 2 || 0, leave.pdpBot.size || 0, leave.pdpBot.size || 0); // Draw the bot's profile picture
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path

			ctx.beginPath(); // Create a new path
			ctx.arc(leave.pdp.background.x || 0, leave.pdp.background.y || 0, leave.pdp.background.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.fillRect(leave.pdp.background.x - leave.pdp.background.size || 0, leave.pdp.background.y - leave.pdp.background.size || 0, leave.pdp.background.size * 2 || 0, leave.pdp.background.size * 2 || 0); // Fill the circle blank
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path

			ctx.beginPath(); // Create a new path
			const pdp = await addImage("/favicon.ico");
			ctx.arc(leave.pdp.background.x || 0, leave.pdp.background.y || 0, leave.pdp.image.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.closePath(); // Close last path
			ctx.drawImage(pdp, leave.pdp.image.x || 0, leave.pdp.image.y || 0, leave.pdp.image.size * 2 || 0, leave.pdp.image.size * 2 || 0); // Draw the member's profile picture
		})();
	}, [modules.leave]);
	return (
		<main className={styles.content}>
			<h2>Annoucements</h2>
			<section id="join">
				<div className={styles.container}>
					<h2>Join</h2>
					<button onClick={() => {
						setModules(mods => ({...mods, join: mods.join ? undefined : guild.modules.join }));
					}} className={`switch ${modules.join ? "active" : ""}`} />
				</div>
				<div className={styles.container}>
					<div className={styles.properties}>
						<select id="joinChannel" value={modules.join ? modules.join.channelId : "none"} onChange={(e) => {
							if (e.target.selectedOptions[0].value === "none") return;
							setModules(mods => ({...mods, join: {
								channelId: e.target.selectedOptions[0].value,
								background: mods.join ? mods.join.background : "",
								message: mods.join ? mods.join.message : ""
							}}));
						}}>
							{
								modules.join ? <></> : <option value="none">Select a channel</option>
							}
							{
								channels.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)
							}
						</select>
						<input type="text" placeholder="Message" maxLength="50" value={modules.join ? modules.join.message : ""} onChange={(e) => {
							setModules(mods => ({...mods, join: {
								channelId: mods.join ? mods.join.channelId : "",
								background: mods.join ? mods.join.background : "",
								message: e.target.value
							}}));
						}} />
						<input type="text" placeholder="Background url" maxLength="75" value={modules.join ? modules.join.background : ""} onChange={(e) => {
							setModules(mods => ({...mods, join: {
								channelId: mods.join ? mods.join.channelId : "",
								background: e.target.value || "",
								message: mods.join ? mods.join.message : ""
							}}));
						}} />
					</div>
					<canvas id="join" />
				</div>
			</section>
			<section id="leave">
				<div className={styles.container}>
					<h2>Leave</h2>
					<button onClick={() => {
						setModules(mods => ({...mods, leave: mods.leave ? undefined : guild.modules.leave }));
					}} className={`switch ${modules.leave ? "active" : ""}`} />
				</div>
				<div className={styles.container}>
					<div className={styles.properties}>
						<select id="leaveChannel" value={modules.leave ? modules.leave.channelId : "none"} onChange={(e) => {
							if (e.target.selectedOptions[0].value === "none") return;
							setModules(mods => ({...mods, leave: {
								channelId: e.target.selectedOptions[0].value,
								background: mods.leave ? mods.leave.background : "",
								message: mods.leave ? mods.leave.message : ""
							}}));
						}}>
							{
								modules.join ? <></> : <option value="none">Select a channel</option>
							}
							{
								channels.filter(channel => channel.type === 0 && (channel.permissions & 2048) === 2048).map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)
							}
						</select>
						<input type="text" placeholder="Message" maxLength="50" value={modules.leave ? modules.leave.message : ""} onChange={(e) => {
							setModules(mods => ({...mods, leave: {
								channelId: mods.leave ? mods.leave.channelId : "",
								background: mods.leave ? mods.leave.background : "",
								message: e.target.value
							}}));
						}} />
						<input type="text" placeholder="Background url" maxLength="75" value={modules.leave ? modules.leave.background : ""} onChange={(e) => {
							setModules(mods => ({...mods, leave: {
								channelId: mods.leave ? mods.leave.channelId : "",
								background: e.target.value || "",
								message: mods.leave ? mods.leave.message : ""
							}}));
						}} />
					</div>
					<canvas id="leave" />
				</div>
			</section>
			<Save comparator={JSON.stringify(guild.modules) !== JSON.stringify(modules)} reset={() => setModules(guild.modules)} save={save} />
		</main>
	);
}

export default Annoucements;