import { IUser } from "@/interfaces/IUser";
import { UserRole } from "@/types/UserRole";

const PROFESSOR_EMAIL_DOMAIN = "@professor.com";

export function resolveUserRole(user: IUser): UserRole | undefined {
  if (user.role === "PROFESSOR" || user.role === "ALUNO") {
    return user.role;
  }

  if (user.role) {
    return undefined;
  }

  return user.email.toLowerCase().endsWith(PROFESSOR_EMAIL_DOMAIN)
    ? "PROFESSOR"
    : "ALUNO";
}

export function filterUsersByRole(users: IUser[], role: UserRole): IUser[] {
  return users.filter((user) => resolveUserRole(user) === role);
}
