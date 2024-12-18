"use client";

import { decodeAdminJWT } from "@/lib/jwt/decode";
import { IUser } from "@/lib/types/user";
import { useEffect, useState } from "react";

export default function Admin() {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await decodeAdminJWT();

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.user) {
          console.log(response.user);
          setUser(response.user);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <h1>Admin Route</h1>
      <p>Access granted to: {user?.email}</p>
      <p>Access Role is {user?.role}</p>
    </>
  );
}
