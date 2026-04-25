export const USER_ROLES = ["Admin", "Host", "Customer"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface UserDocument {
  userID: string;
  userName: string;
  email: string;
  password: string;
  Role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<UserDocument, "password">;
