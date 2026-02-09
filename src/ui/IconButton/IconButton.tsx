import styles from './IconButton.module.scss';

import okLogo from '../../assets/ok.svg';
import closeLogo from '../../assets/close.svg';
import editLogo from '../../assets/edit.svg';
import deleteLogo from '../../assets/delete.svg';
import { ButtonHTMLAttributes } from 'react';

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

type Variant = 'primary' | 'secondary' | 'danger';
type IconType = 'ok' | 'close' | 'edit' | 'delete';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: IconType;
}

export default function IconButton({ variant, icon = 'ok', ...props }: IconButtonProps) {
  const variantClass = variant ? variantStyles[variant] : '';
  return (
    <button className={`${styles.iconButton} ${variantClass}`} {...props}>
      <img src={variantIcons[icon]} alt={variant} />
    </button>
  );
}
