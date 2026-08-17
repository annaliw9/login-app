import { useAuth } from "../auth/AuthContext";

export function useRoleAccess() {
  const { user } = useAuth();

  const canEdit = user?.role === "read-write";
  const isReadOnly = user?.role === "read-only";

  return {
    user,
    canEdit,
    isReadOnly,
  };
}
