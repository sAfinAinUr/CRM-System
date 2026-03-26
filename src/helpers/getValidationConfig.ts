export const UI_CONFIG = {
  PURPLE_COLOR: '#7F265B',
  MAX_WIDTH: '420px',
  INPUT_HEIGHT: 45,
  SUCCESS_PADDING: '50px',
};

export const VALIDATION = {
  USERNAME: { MIN: 1, MAX: 60, PATTERN: /^[а-яА-Яa-zA-Z\s]+$/ },
  LOGIN: { MIN: 2, MAX: 64, PATTERN: /^[a-zA-Z]+$/ },
  PASSWORD: { MIN: 6, MAX: 60 },
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
};
