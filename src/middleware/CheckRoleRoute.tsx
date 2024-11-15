import { ReactNode, useEffect } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import { ROLE, UserType } from "../types/user.type";

const CheckRoleRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: ROLE[];
}) => {
  const user = useLoaderData() as UserType;

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (roles && !roles.includes(user.role)) {
      window.location.href = "/login";
      return;
    }
  }, [roles, user]);

  return <>{children}</>;
};

export default CheckRoleRoute;

export const LoginRoute = ({ children }: { children: ReactNode }) => {
  const user = useLoaderData();

  if (user) return <Navigate to={"/profile"} replace />;

  return children;
};
