"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserEmail(data.user.email);
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex justify-between items-center bg-gray-800 text-white px-6 py-4 z-20">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        Dashboard
      </h1>
      <div className="flex items-center space-x-4">
        {userEmail && <span>Welcome, {userEmail}</span>}
        <Button
          onClick={handleLogout}
          className="bg-red-600 p-4 rounded hover:bg-red-700"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
