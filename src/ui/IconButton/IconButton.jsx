import styles from './IconButton.module.scss';

import okLogo from '../../assets/ok.svg';
import closeLogo from '../../assets/close.svg';
import editLogo from '../../assets/edit.svg';
import deleteLogo from '../../assets/delete.svg';

const variantStyles = {
  primary: styles.ok,
  secondary: styles.close,
  danger: styles.delete,
};

export const variantIcons = {
  ok: okLogo,
  close: closeLogo,
  delete: deleteLogo,
  edit: editLogo,
};

export default function IconButton({ variant = 'default', icon = 'ok', ...props }) {
  return (
    <button className={`${styles.iconButton} ${variantStyles[variant] || ''}`} {...props}>
      <img src={variantIcons[icon]} alt={variant} />
    </button>
  );
}
