import { IUserFormValues } from "@/interfaces/IUser";

export type UserFormField = keyof IUserFormValues;

export type UserFormErrors = Partial<Record<UserFormField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateUserForm(
  values: IUserFormValues,
  isEditing: boolean,
): UserFormErrors {
  const errors: UserFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Informe o nome.";
  }

  if (!values.username.trim()) {
    errors.username = "Informe o nome de usuário.";
  } else if (/\s/.test(values.username.trim())) {
    errors.username = "O nome de usuário não pode conter espaços.";
  }

  if (!values.email.trim()) {
    errors.email = "Informe o e-mail.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!values.password) {
    if (!isEditing) {
      errors.password = "Informe a senha.";
    }
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}
