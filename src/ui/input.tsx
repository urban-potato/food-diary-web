import { FC } from "react";
import styles from "./input.module.css";

interface PropsType {
  id: string;
  type: string;
  placeholder?: string | number;
  register: any;
  errorMessage: any;
  bg?: string | null;
}

const Input: FC<PropsType> = ({
  id,
  type,
  placeholder,
  register,
  errorMessage,
  // bg = "#1B1B23",
  bg = "#FFFFFF",
}) => {
  return (
    <div className={styles.form}>
      <label htmlFor={id} className={styles.label}>
        {placeholder}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        style={{ backgroundColor: bg }}
        className={styles.input}
      />
      <p className={styles.errorMessage}>{errorMessage}</p>
    </div>
  );
};

export default Input;
