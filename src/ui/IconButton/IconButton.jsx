import styles from './IconButton.module.scss';

export default function IconButton({ children, className, ...props }) {
  return (
    <button className={`${styles.Iconbutton} ${styles[className] || ''}`} {...props}>
      {children}
    </button>
  );
}
