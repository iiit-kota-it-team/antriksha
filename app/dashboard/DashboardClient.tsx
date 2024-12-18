"use client";

import { IUser } from "@/lib/types/user";

interface DashboardClientProps {
  user: IUser;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <p>Role of user: {user.role}</p>
      <form action="/logout" method="POST">
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
