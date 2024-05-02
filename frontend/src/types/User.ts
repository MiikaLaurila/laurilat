export interface LoginPrompt {
  username: string;
  password: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  admin: boolean;
  profileImage: string;
}

export const isUser = (data: unknown): data is User => {
  if (data) {
    return ['name', 'username', 'email', 'admin', 'profileImage'].every((k) =>
      Object.prototype.hasOwnProperty.call(data, k)
    );
  }
  return false;
};

export interface NewUserPrompt {
  name: string;
  username: string;
  email: string;
  admin: boolean;
  password: string;
}
