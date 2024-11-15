import { UserType } from "../types/user.type";
import { useLoaderData } from "react-router-dom";

export const useJWTPayload = () => {
  const user = useLoaderData() as Pick<UserType, "id" | "role" | "studentID">;
  return { user };
};
