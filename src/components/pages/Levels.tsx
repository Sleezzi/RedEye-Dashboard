import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../cdn/css/guild/levels.module.css";
import Save from "../Save";
import { AddImageCanvas, Client, Guild, User } from "../../interfacies";

const properties = {
	image: {
		width: 1024,
		height: 400,
		background: "https://redeye.sleezzi.fr/cdn/img/canvas-background-level.png"
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
			x: 227,
			get y() {
				return properties.image.height / 2;
			},
			size: 123
		},
		image: {
			get x() {
				return properties.pdp.background.x - properties.pdp.image.size;
			},
			get y() {
				return properties.image.height / 2 - properties.pdp.image.size;
			},
			get size() {
				return properties.pdp.background.size - 4;
			}
		}
		
	},
	username: {
		x: 625,
		get y() {
			return properties.image.height / 3
		},
		size: 64,
		get lineWidth() {
			return Math.floor(properties.username.size / 20);
		},
	},
	level: {
		get x() {
			return 625 - properties.progressBar.with / 2;
		},
		get y() {
			return properties.image.height / 3 + 55 + properties.xp.size / 2;
		},
		size: 35,
		get lineWidth() {
			return Math.floor(properties.level.size / 20);
		},
		textAlign: "start"
	},
	xp: {
		get x() {
			return properties.progressBar.x + properties.progressBar.with - 4;
		},
		get y() {
			return properties.progressBar.y + properties.xp.size + 2;
		},
		size: 35,
		get lineWidth() {
			return Math.floor(properties.xp.size / 20);
		},
	},
	progressBar: {
		get x() {
			return 625 - properties.progressBar.with / 2;
		},
		get y() {
			return properties.image.height / 3 + 55 * 2 - properties.progressBar.height / 2;
		},
		height: 50,
		with: 350,
		color: `#${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	},
	pdpBot: {
		get x() {
			return properties.image.width - properties.pdpBot.size / 2 - 7;
		},
		get y() {
			return properties.image.height - properties.pdpBot.size / 2 - 7;
		},
		size: 50
	}
}
function Levels({ token, client }: { token: string, client: Client }) {
	const { guild, setGuild, user }: { guild: Guild, setGuild: Dispatch<SetStateAction<Guild | undefined>>, user: User } = useOutletContext();
	const [levels, setLevels] = useState(guild.modules.levels ? guild.modules.levels : { active: false, channel: "" });
	
	useEffect(() => console.log(levels), [levels]);
	useEffect(() => {
		(async () => {
			const canvas: HTMLCanvasElement | null = document.querySelector(`canvas#levels`);
			if (!canvas) return;
			canvas.height = properties.image.height;
			canvas.width = properties.image.width;
			const ctx = canvas.getContext("2d"); // Initialize canvas
			if (!ctx) return;
			const background = await (new AddImageCanvas(properties.image.background).img());
			ctx.drawImage(background, 0, 0, properties.image.width, properties.image.height); // Draw the background image
			
			// Drawn overlay
			ctx.fillStyle = properties.overlay.color || "#FFF"; // Make the text white
			ctx.fillRect(properties.overlay.x || 0, properties.overlay.y || 0, properties.overlay.width || 0, properties.overlay.height || 0); // Fill the circle blank
			
			// Username
			ctx.font = `${properties.username.size || 42}px "Protest Strike"`; // Change the text font
			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.textAlign = "center"; // Position the text in the center
			ctx.lineWidth = properties.username.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText("REDEYE", properties.username.x || 0, properties.username.y || 0); // Write the member's name
			ctx.strokeText("REDEYE", properties.username.x || 0, properties.username.y || 0); // Write the member's name
			
			ctx.font = `${properties.level.size || 42}px "Protest Strike"`; // Change the text font
			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.textAlign = "start"; // Position the text in the center
			ctx.lineWidth = properties.level.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText(`Level: 3`, properties.level.x || 0, properties.level.y || 0); // Writes the member level
			ctx.strokeText(`Level: 3`, properties.level.x || 0, properties.level.y || 0);
			
			// Progress bar
			ctx.fillRect(properties.progressBar.x || 0, properties.progressBar.y || 0, properties.progressBar.with || 0, properties.progressBar.height || 0); // Fill the circle blank
			ctx.fillStyle = properties.progressBar.color || "#00F"; // Make the text white
			ctx.fillRect(properties.progressBar.x || 0, properties.progressBar.y || 0, (300 / (3 * 150) * properties.progressBar.with) || 0, properties.progressBar.height || 0); // Fill the circle blank
			
			// XP Text
			ctx.fillStyle = "#FFF"; // Make the text white
			ctx.font = `35px "Protest Strike"`; // Change the text font
			ctx.textAlign = "end"; // Position the text in the center
			ctx.lineWidth = properties.xp.lineWidth || 4;  //define the width of the stroke line
			ctx.fillText(`300/${3 * 150}`, properties.xp.x || 0, properties.xp.y || 0); // Writes the member level
			ctx.strokeText(`300/${3 * 150}`, properties.xp.x || 0, properties.xp.y || 0);
			
			// Put a margin with the overlay to the pdp bot
			ctx.beginPath();
			ctx.save(); // Save the image
			ctx.arc(properties.pdpBot.x || 0, properties.pdpBot.y || 0, properties.pdpBot.size / 2 + properties.overlay.margin / 1.25, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(background, 0, 0, properties.image.width, properties.image.height); // Draw the background image
			ctx.closePath();
			
			// Drawn bot logo
			ctx.beginPath(); // Create a new path
			const pdpbot = await (new AddImageCanvas("/favicon.ico").img()); // Load the bot's profile image
			ctx.arc(properties.pdpBot.x || 0, properties.pdpBot.y || 0, properties.pdpBot.size / 2, 0, Math.PI * 2); // Draw a circle
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.drawImage(pdpbot, properties.pdpBot.x - properties.pdpBot.size / 2, properties.pdpBot.y - properties.pdpBot.size / 2 || 0, properties.pdpBot.size || 0, properties.pdpBot.size || 0); // Draw the bot's profile picture
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path
			
			// Drawn the user profile picture
			ctx.beginPath(); // Create a new path
			ctx.arc(properties.pdp.background.x || 0, properties.pdp.background.y || 0, properties.pdp.background.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.fillRect(properties.pdp.background.x - properties.pdp.background.size || 0, properties.pdp.background.y - properties.pdp.background.size || 0, properties.pdp.background.size * 2 || 0, properties.pdp.background.size * 2 || 0); // Fill the circle blank
			ctx.restore(); // Restore the sheet
			ctx.closePath(); // Close last path
			
			ctx.beginPath(); // Create a new path
			const pdp = await (new AddImageCanvas(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`).img()); // Load member image
			ctx.arc(properties.pdp.background.x || 0, properties.pdp.background.y || 0, properties.pdp.image.size || 0, 0, Math.PI * 2); // Draw a circle
			ctx.save(); // Save the image
			ctx.clip(); // Cut the sheet so that you can only write in this circle
			ctx.closePath(); // Close last path
			ctx.drawImage(pdp, properties.pdp.image.x || 0, properties.pdp.image.y || 0, properties.pdp.image.size * 2 || 0, properties.pdp.image.size * 2 || 0); // Draw the member's profile picture
		})();
	}, [user]);
	const save = async () => {
		try {
			const response = await fetch(`${client.url}/modules/levels?id=${guild.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token
				},
				body: JSON.stringify(levels)
			});
			if (response.status === 200) {
				const modules = {...guild.modules};
				modules.levels = levels as any;
				setGuild((oldGuild: any) => ({...oldGuild,
					modules: modules
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
			<h2>Levels</h2>
			<div className={styles.container}>
				<h4>Activate the leveling system:</h4>
				<button onClick={() => setLevels(lvl => ({...lvl, active: !lvl.active, channel: !lvl.active === true && lvl.channel ? lvl.channel : "" }))} className={`switch ${levels.active ? "active" : ""}`} />
			</div>
			<h4>Channel</h4>
			<select name="channel" value={levels.channel !== "" ? levels.channel : "none"} onChange={(e) => setLevels(l => ({...l, channel: e.target.selectedOptions[0].value, active: true}))}>
				<option disabled value="none">None</option>
				{
					guild.channels
					?.filter((channel) => channel.type === 0 && (channel.permissions & 2048) === 2048)
					.map((channel) => levels.channel === channel.id ? <option disabled key={channel.id} value={channel.id}>{channel.name}</option> : <option key={channel.id} value={channel.id}>{channel.name}</option>)
				}
			</select>
			<canvas id="levels" />
			<Save comparator={JSON.stringify(guild.modules.levels) !== JSON.stringify(levels)} reset={() => setLevels(guild.modules.levels)} save={save} />
		</main>
	);
}

export default Levels;