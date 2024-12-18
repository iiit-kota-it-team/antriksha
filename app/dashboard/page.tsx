"use client";
import { decodeUserJwt } from "@/lib/jwt/decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/lib/types/user";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await decodeUserJwt();

        if (resp.error) {
          router.push("/login");
          return;
        }

        if (resp.user) {
          setUser(resp.user);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [router]);

  return (
    <>
      <h1>hello</h1>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <p>{user?.name}</p>
      <Link href="http://localhost:3000/logout">Sign Out</Link>
    </>
  );
}
