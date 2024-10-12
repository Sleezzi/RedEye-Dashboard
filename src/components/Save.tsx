import styles from "../cdn/css/save.module.css"
function Save({ comparator: visible, reset, save }: { comparator: boolean, reset: () => any, save: () => any }) {
	return (
		<div className={`${styles.saveContainer} ${visible ? styles.active : ""}`}>
			<p>You have unsaved changes!</p>
			<div>
				<button id={styles.reset} onClick={async (e: any) => {
					if (!visible) return;
					e.target.innerText = "...";
					await reset();
					e.target.innerText = "Reset";
				}}>Reset</button>
				<button id={styles.save} onClick={async (e: any) => {
					if (!visible) return;
					e.target.className = styles.loading;
					document.querySelector(`#${styles.reset}`)?.setAttribute("disabled", "");
					e.target.disabled = true;
					await save();
					document.querySelector(`#${styles.reset}`)?.removeAttribute("disabled");
					e.target.removeAttribute("disabled");
					e.target.className = "";
				}}>Save</button>
			</div>
		</div>
	);
}

export default Save;