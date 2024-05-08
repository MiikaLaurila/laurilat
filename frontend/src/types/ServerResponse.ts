import { EditablePost, isEditablePost } from './EditablePost';
import { User, isUser } from './User';

export interface ServerResponse {
  success: boolean;
  message: string;
  error?: unknown;
  data?: unknown;
}

export interface ServerResponseError {
  status: number;
  data: ServerResponse;
}

export interface ServerDataResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export interface ServerErrorResponse {
  success: boolean;
  message: string;
  error: unknown;
}

export interface UserResponse extends ServerResponse {
  data: User;
}

export interface EditablePostResponse extends ServerResponse {
  data: EditablePost;
}

export const isServerResponseError = (error: unknown): error is ServerResponseError => {
  if (error) {
    return ['data', 'status'].every((k) => Object.prototype.hasOwnProperty.call(error, k));
  }
  return false;
};

export const isServerResponse = (response: unknown): response is ServerResponse => {
  if (response) {
    return ['success', 'message'].every((k) => Object.prototype.hasOwnProperty.call(response, k));
  }
  return false;
};

export const isServerDataResponse = (response: unknown): response is ServerDataResponse => {
  if (isServerResponse(response)) {
    return Object.prototype.hasOwnProperty.call(response, 'data');
  }
  return false;
};

export const isServerErrorResponse = (response: unknown): response is ServerErrorResponse => {
  if (isServerResponse(response)) {
    return Object.prototype.hasOwnProperty.call(response, 'error');
  }
  return false;
};

export const isUserResponse = (response: unknown): response is UserResponse => {
  if (isServerDataResponse(response)) {
    return isUser(response.data);
  }
  return false;
};

export const isEditablePostResponse = (response: unknown): response is EditablePostResponse => {
  if (isServerDataResponse(response)) {
    return isEditablePost(response.data);
  }
  return false;
};
