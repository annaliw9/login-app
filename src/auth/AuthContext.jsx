import { createContext, useContext, useState } from "react";
import { findUser, MOCK_MFA_CODE } from "./mockUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  // console.log("AuthProvider", {
  //   user,
  //   pendingUser,
  // });

  const login = (email, password) => {
    const matched = findUser(email, password);

    // console.log("LOGIN RESULT:", {
    //   email,
    //   matched,
    // });

    if (!matched) return { success: false, error: "Invalid Email or Password" };

    setPendingUser({
      email: matched.email,
      name: matched.name,
      role: matched.role,
    });
    return { success: true };
  };

  const verifyMfa = (code) => {
    if (!pendingUser) return { success: false, error: "Please Sign In again" };

    if (code !== MOCK_MFA_CODE)
      return { success: false, error: "Invalid verification code" };

    setUser(pendingUser);
    setPendingUser(null);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
  };

  const value = {
    user,
    pendingUser,
    login,
    verifyMfa,
    logout,
    isAuthenticated: Boolean(user),
    isMfaPending: Boolean(pendingUser) && !user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
