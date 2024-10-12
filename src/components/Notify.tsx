import { useEffect } from "react";
import styles from "../cdn/css/notify.module.css";
function Notify({ notifications, setNotifications }: { notifications: any, setNotifications: any }) {
	useEffect(() => {
		for (const [id, notification] of (Object.entries(notifications) as [string, any])) {
			if (document.querySelector(`#${styles.notify} button.${styles.notif}[notif-id="${id}]`)) return;
			const button = document.createElement("button");
			button.className = styles.notif;
			button.setAttribute("notif-id", id);
			button.onclick = () => {
				button.remove();
				const newNotifications = {...notifications};
				delete newNotifications[id];
				setNotifications(newNotifications);
			}
			
			const progressBar = document.createElement("div");
			progressBar.className = styles.progressbar;
			progressBar.style.animationDuration = `${notification.duration}s`;
			progressBar.onanimationend = () => {
				button.remove();
				const newNotifications = {...notifications};
				delete newNotifications[id];
				setNotifications(newNotifications);
			}
			button.appendChild(progressBar);
			
			const title = document.createElement("h4");
			title.innerText = notification.title;
			button.appendChild(title);
			
			const message = document.createElement("h5");
			message.innerText = notification.message;
			button.appendChild(message);
			
			const audio = document.createElement("audio");
			audio.src = "/cdn/audio/notification.mp3";
			audio.onload = () => {
				audio.play();
			}
			button.appendChild(audio);
		}
	}, [notifications]);
	
	return (
		<div id={styles.notify}>{
		}</div>
	);
}
export default Notify;