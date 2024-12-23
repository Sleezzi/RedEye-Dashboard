import { motion } from "framer-motion";


function Transition(OgComponent: any) {
	return () => (<>
		<motion.div
			className="loadingBar"
			initial={{width: "0"}}
			animate={{width: "0"}}
			exit={{width: "100%"}}
			transition={{duration: 1, ease: [0.22, 1, 0.36, 1] }}
		/>
		<OgComponent />
	</>);
}

export default Transition;