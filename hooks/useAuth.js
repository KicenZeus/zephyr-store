"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectIfNoSession = true) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem("user_session");
      if (session) {
        setUser(JSON.parse(session));
        setLoading(false);
        return;
      }

      if (redirectIfNoSession) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router, redirectIfNoSession]);

  const logout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  return { user, loading, logout };
}

