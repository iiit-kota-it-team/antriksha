"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IUser } from "@/lib/types/user";
import { decodeOnboardingToken } from "@/lib/jwt/decode";
import { SetCookies } from "@/lib/jwt/setCookie";

export default function Onboarding() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [addr, setAddr] = useState("");
  const [userData, setUserData] = useState<IUser>();
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      const token = searchParams.get("token");

      try {
        if (token == null) {
          router.push("/login");
          return;
        }
        const result = await decodeOnboardingToken(token);
        if (result.error) {
          console.log(result.error);
          router.push("/login");
          return;
        }

        if (result.user) {
          setUserData(result.user);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchUserData();
  }, [searchParams, router]);

  async function handleOnBoarding(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!college.trim()) {
      setError("Please enter your college name");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!gender) {
      setError("Please select your gender");
      return;
    }

    if (!addr.trim()) {
      setError("Please enter your address");
      return;
    }

    if (!userData) return;

    try {
      const { error } = await supabase.from("users").upsert({
        name: userData.name,
        google_id: userData.google_id,
        email: userData.email,
        college: college.trim(),
        phone: phone,
        gender: gender,
        addr: addr.trim(),
      });

      if (error) throw error;

      const token = searchParams.get("token")!;

      await SetCookies(token);

      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setError("An error occurred during registration. Please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleOnBoarding} className="space-y-4">
        <input
          type="text"
          name="college"
          id="college"
          placeholder="Enter Your College Name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder="Enter Your Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
          pattern="\d{10}"
          required
        />
        <input
          type="text"
          placeholder="Enter Your City, State"
          name="addr"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          onChange={(e) => setGender(e.target.value)}
          value={gender}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled hidden>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}
