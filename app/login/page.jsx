"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // const handleLogin = async () => {
  //   const { error } = await supabase.auth.signInWithOtp({ email });
  //   if (error) setMessage(error.message);
  //   else setMessage("Check your email for the magic link.");
  // };

  const handleLogin = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/send-login-link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const data = await res.json();
    if (res.ok) setMessage(data.message);
    else setMessage(data.error || "Failed to send login link");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <LoginForm
        email={email}
        setEmail={setEmail}
        handleLogin={handleLogin}
        message={message}
      />
    </div>
  );
}
