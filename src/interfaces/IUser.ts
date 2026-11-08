import { UserRole } from "@/types/UserRole";
import type { Href } from "expo-router";
import type {
  UserFormErrors,
  UserFormField,
} from "@/features/users/utils/validation";
import { UserStatus } from "@/types/UserStatus";

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  isActive: boolean;
  role?: string;
}

export interface IUserFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  status: UserStatus;
}

export interface ICreateUserPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export type IUpdateUserPayload = Partial<Omit<ICreateUserPayload, "role">>;

export interface IUserFormProps {
  role: UserRole;
  values: IUserFormValues;
  errors: UserFormErrors;
  isEditing: boolean;
  canChangeStatus: boolean;
  isSaving: boolean;
  submitError: string;
  onChange: <F extends UserFormField>(
    field: F,
    value: IUserFormValues[F],
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface IUserRoleConfig {
  singular: string;
  plural: string;
  listTitle: string;
  createTitle: string;
  editTitle: string;
  listHref: Href;
  createHref: Href;
  editHref: (id: string) => Href;
}

export interface IUserGroupCardProps {
  title: string;
  description: string;
  label: string;
  onPress: () => void;
}

export interface IUserCardProps {
  user: IUser;
  isCurrentUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ITextActionProps {
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export interface IUserStatusBadgeProps {
  isActive: boolean;
}

export interface ITeacherUsersScreenProps {
  role: UserRole;
}

export interface ITeacherUserFormScreenProps {
  role: UserRole;
}
