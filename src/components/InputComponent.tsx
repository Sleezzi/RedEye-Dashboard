import { ChangeEventHandler, CSSProperties, useState } from "react";
import styles from "../cdn/css/input.module.css";

function Input({
	defaultValue,
	value,
	placeholder,
	maxLength,
	onChange,
	style,
	className
}: {
	defaultValue?: string,
	value?: string,
	placeholder?: string,
	maxLength: number,
	onChange?: ChangeEventHandler<HTMLTextAreaElement>,
	style?: CSSProperties,
	className?: string
}) {
	const [length, setLength] = useState(defaultValue?.length || 0);
	return (
		<div className={className ? `${styles.inputContainer} ${className}` : styles.inputContainer}>
			<textarea
				value={value}
				defaultValue={defaultValue || ""}
				placeholder={placeholder || ""}
				maxLength={maxLength}
				onChange={(e) => {
					if (onChange) onChange(e);
					setLength(e.target.value.length);
				}}
				style={style || {}}
			/>
			<div className={`${styles.maxLength}${length >= maxLength ? ` ${styles.max}` : ""}`}>{length}/{maxLength}</div>
		</div>
	)
}

export default Input;