export function verifyTodoText(text: string): { isNotValid: boolean; message?: string } {
  if (text.length < 2) {
    return {
      isNotValid: true,
      message: `Количество символов должно быть больше 2. Количество символов сейчас: ${text.length}`,
    };
  } else if (text.length > 65) {
    return {
      isNotValid: true,
      message: `Количество символов должно быть меньше 65. Количество символов сейчас: ${text.length}`,
    };
  } else if (text.trim().length < 2) {
    return {
      isNotValid: true,
      message: 'Недопустимый формат. Количество символов помимо пробела должно быть не меньше 2',
    };
  }
  return { isNotValid: false };
}
