import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const resp = await supabase.auth.getUser();

  if (!resp) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <p>Logged in as: {resp.data.user?.email}</p>
      <form action="/logout" method="POST">
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
