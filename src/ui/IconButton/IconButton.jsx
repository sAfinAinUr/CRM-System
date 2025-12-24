import styles from './IconButton.module.scss';

export default function IconButton({ children, className, ...props }) {
  let additionallStyle;
  switch (className) {
    case 'delete':
      additionallStyle = styles.delete;
      break;
    case 'ok':
      additionallStyle = styles.ok;
      break;
    case 'close':
      additionallStyle = styles.close;
      break;
  }
  return (
    <button
      className={className ? styles.Iconbutton + ' ' + additionallStyle : styles.Iconbutton}
      {...props}>
      {children}
    </button>
  );
}
