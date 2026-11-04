import { IApiResponse } from "@/interfaces/IApi";
import {
  ICreateUserPayload,
  IUpdateUserPayload,
  IUser,
} from "@/interfaces/IUser";
import { ApiRequest } from "@/types/Api";

export async function getUsers(request: ApiRequest): Promise<IUser[]> {
  const response = await request<IApiResponse<IUser[]>>("/catalog/users", {
    method: "GET",
  });

  return response.data;
}

export async function createUser(
  request: ApiRequest,
  payload: ICreateUserPayload,
): Promise<IUser> {
  const response = await request<IApiResponse<IUser>>("/catalog/users", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function updateUser(
  request: ApiRequest,
  id: string,
  payload: IUpdateUserPayload,
): Promise<IUser> {
  const response = await request<IApiResponse<IUser>>(`/catalog/users/${id}`, {
    method: "PUT",
    body: payload,
  });

  return response.data;
}

export async function deleteUser(
  request: ApiRequest,
  id: string,
): Promise<void> {
  await request<void>(`/catalog/users/${id}`, {
    method: "DELETE",
  });
}
