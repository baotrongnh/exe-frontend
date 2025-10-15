"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { authHelpers } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: "normal" | "employer" | null;
  signOut: () => Promise<void>;
  getAccessToken: () => string | null;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"normal" | "employer" | null>(null);

  useEffect(() => {
    // Lấy session hiện tại
    const getInitialSession = async () => {
      try {
        const { data } = await authHelpers.getCurrentUser();
        setUser(data.user);

        // Cũng lấy session để có access token
        const { data: sessionData } = await authHelpers.getSession();
        setSession(sessionData.session);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Lắng nghe thay đổi auth state
    const {
      data: { subscription },
    } = authHelpers.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session as Session);
      setUser((session as Session)?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserRole = async () => {
    if (!user) {
      setUserRole(null);
      return;
    }

    try {
      // Kiểm tra xem user có employer profile không
      const { data } = await authHelpers.getCurrentUser();
      const role = data.user?.user_metadata?.role as "normal" | "employer" | undefined;
      setUserRole(role || "normal");
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("normal");
    }
  };

  useEffect(() => {
    if (user) {
      refreshUserRole();
    } else {
      setUserRole(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const signOut = async () => {
    await authHelpers.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  const getAccessToken = () => {
    return session?.access_token || null;
  };

  return <AuthContext.Provider value={{ user, session, loading, userRole, signOut, getAccessToken, refreshUserRole }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
