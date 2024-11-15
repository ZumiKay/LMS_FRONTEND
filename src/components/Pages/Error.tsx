import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import Logo from "../../Image/LMS_LOGO.svg";

import { Button } from "@nextui-org/react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const Element = () => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return (
          <>
            <h3 className="text-2xl font-bold text-red-500">
              404 | Page not found
            </h3>
          </>
        );
      }

      if (error.status === 401) {
        return (
          <>
            <h3 className="text-2xl font-bold text-red-500">401 | Fobbidean</h3>
          </>
        );
      }

      if (error.status === 500) {
        return (
          <>
            <h3 className="text-2xl font-bold text-red-500">
              500 | Error Occured
            </h3>
            <p>Please Contact Us If This is a mistake</p>
          </>
        );
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center text-black">
        <img src={Logo} alt="logo" className="w-[100px] h-[100px]"></img>
        <Element />
        <Button
          onClick={() => navigate("/", { replace: true })}
          color="default"
          size="lg"
          className="mt-10 text-gray-700 font-bold"
        >
          Go To Home
        </Button>
      </div>
    </>
  );
}

export function ErrorComponent() {}
