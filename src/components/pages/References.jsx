import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../cdn/css/references.module.css";

function References() {
	const [references, setReferences] = useState([]);
	useEffect(() => {
		fetch("/cdn/references.json")
		.then(response => response.json())
		.then(response => setReferences(response));
	}, []);
	return (<main className={styles.content}>
		<div className={styles.references}>
			{
				references.map((reference, index) => (
					reference.url ?
						<a href={reference.url} target="_blank" className={styles.card} key={index}>
							<img
								src={reference.images[0]}
								onMouseEnter={(e) => {if (reference.images.length > 1) e.target.src = reference.images[1] }}
								alt={`Image de ${reference.name}`}
								onMouseLeave={(e) => e.target.src = reference.images[0]}
							/>
							<h3>{`${reference.category} - ${reference.name}`}</h3>
						</a>
					:
						<div className={styles.card} key={index}>
							<img
								src={reference.images[0]}
								onMouseEnter={(e) => {if (reference.images.length > 1) e.target.src = reference.images[1] }}
								alt={`Image de ${reference.name}`}
								onMouseLeave={(e) => e.target.src = reference.images[0]}
							/>
							<h3>{`${reference.category} - ${reference.name}`}</h3>
						</div>
				))
			}
		</div>
	</main>);
}

export default References;