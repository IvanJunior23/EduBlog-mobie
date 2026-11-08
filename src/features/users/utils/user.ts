import { IUser } from "@/interfaces/IUser";
import { UserRole } from "@/types/UserRole";

export function resolveUserRole(user: IUser): UserRole | undefined {
  if (user.role === "PROFESSOR" || user.role === "ALUNO") {
    return user.role;
  }

  return undefined;
}

export function resolveParam(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
}

export function filterUsersByRole(users: IUser[], role: UserRole): IUser[] {
  return users.filter((user) => resolveUserRole(user) === role);
}
