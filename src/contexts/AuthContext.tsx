
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuthOperations } from "@/hooks/auth/use-auth-operations";
import { isAdminEmail, isUserAdmin } from "@/lib/auth-helpers";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  resetPassword: async () => ({})
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut, resetPassword: authResetPassword } = useAuthOperations();

  // Check if user has admin role
  const checkAdminStatus = async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    
    try {
      // First check admin status from user metadata or email
      const adminFromMetadata = 
        currentUser.user_metadata?.role === 'admin' ||
        currentUser.app_metadata?.role === 'admin';
        
      const adminFromEmail = isAdminEmail(currentUser.email);
      
      // If not admin by metadata or email, check in database
      let isDbAdmin = false;
      if (!adminFromMetadata && !adminFromEmail) {
        isDbAdmin = await isUserAdmin(currentUser.id);
      }
      
      setIsAdmin(adminFromMetadata || adminFromEmail || isDbAdmin);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  // Initialize auth state when component mounts
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for mock session
        const mockSessionStr = localStorage.getItem("supabase-mock-session");
        if (mockSessionStr) {
          try {
            const mockSessionData = JSON.parse(mockSessionStr);
            // Check if mock session is expired
            if (mockSessionData.expires_at > Math.floor(Date.now() / 1000)) {
              console.log("Found valid mock session, setting user state");
              // Create a proper Session object with all required fields
              const mockSession: Session = {
                access_token: mockSessionData.access_token,
                refresh_token: mockSessionData.refresh_token,
                user: mockSessionData.user,
                expires_at: mockSessionData.expires_at,
                expires_in: mockSessionData.expires_at - Math.floor(Date.now() / 1000),
                token_type: "bearer"
              };
              
              setSession(mockSession);
              setUser(mockSession.user);
              await checkAdminStatus(mockSession.user);
              setIsLoading(false);
              return;
            } else {
              // Clear expired mock session
              localStorage.removeItem("supabase-mock-session");
            }
          } catch (error) {
            console.error("Error parsing mock session:", error);
            localStorage.removeItem("supabase-mock-session");
          }
        }
        
        // Check for real Supabase session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }
        
        if (sessionData?.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          await checkAdminStatus(sessionData.session.user);
        } else {
          // No valid session
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    
    // Set up auth state listener
    const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("supabase-mock-session");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      } else if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        await checkAdminStatus(currentSession.user);
      }
    });
    
    // Properly handle unsubscribing
    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  // Wrap the auth operations
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authSignIn(email, password);
      if (result.data?.user) {
        setUser(result.data.user);
        setSession(result.data.session);
        await checkAdminStatus(result.data.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await authSignUp(email, password, name);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authSignOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await authResetPassword(email);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
