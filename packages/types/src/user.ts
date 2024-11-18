export type User = {
  id: string;
  role: string;
  username: string;
  password_hash: string;
  profile_pic_url: string;
  created_at?: Date;
  updated_at?: Date;
};

export type CreateUserDTO = Omit<User, "id" | "created_at" | "updated_at">;

export type UpdateUserDTO = Partial<
  Omit<User, "id" | "created_at" | "updated_at">
>;

export type PublicUser = Omit<User, "password_hash">;
