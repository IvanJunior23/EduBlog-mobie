import { UserRole } from "@/types/UserRole";
import { Href } from "expo-router";

interface IUserRoleConfig {
  singular: string;
  plural: string;
  listTitle: string;
  createTitle: string;
  editTitle: string;
  listHref: Href;
  createHref: Href;
  editHref: (id: string) => Href;
}

export const USER_ROLE_CONFIG: Record<UserRole, IUserRoleConfig> = {
  PROFESSOR: {
    singular: "professor",
    plural: "professores",
    listTitle: "Professores",
    createTitle: "Novo Professor",
    editTitle: "Editar Professor",
    listHref: "/teacher/teachers" as Href,
    createHref: "/teacher/teachers/new" as Href,
    editHref: (id) => `/teacher/teachers/${id}/edit` as Href,
  },

  ALUNO: {
    singular: "aluno",
    plural: "alunos",
    listTitle: "Alunos",
    createTitle: "Novo Aluno",
    editTitle: "Editar Aluno",
    listHref: "/teacher/students" as Href,
    createHref: "/teacher/students/new" as Href,
    editHref: (id) => `/teacher/students/${id}/edit` as Href,
  },
};
