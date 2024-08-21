import styles from "../cdn/css/notify.module.css";
function Notify({ notifications, setNotifications }) {
	return (
		<div id={styles.notify}>{
			notifications
			.filter(notification => notification.title && notification.message && notification.duration)
			.map(({title, message, duration}, index) => 
				<button key={index} className={styles.notif} onClick={() => {
					const newNotifications = [...notifications];
					newNotifications.splice(index);
					setNotifications(newNotifications);
				}}>
					<div className={styles.progressbar} style={{animationDuration: `${duration}s`}} onAnimationEnd={() => {
						const newNotifications = [...notifications];
						newNotifications.splice(index);
						setNotifications(newNotifications);
					}}></div>
					<h4>{title}</h4>
					<h5>{message}</h5>
					<audio src="/cdn/audio/notification" autoPlay onLoad={(e) => e.target.play()} />
				</button>
			)
		}</div>
	);
}
export default Notify;