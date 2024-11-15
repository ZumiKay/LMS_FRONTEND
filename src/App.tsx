import "./App.css";
import { Outlet, useLoaderData } from "react-router-dom";
import "./style/style.css";
import NavigationBar from "./components/Navigation/NavigationBar";
import FooterComponent from "./components/Footer";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import { UserType } from "./types/user.type";
import { useGlobalContext } from "./types/context.type";
import { useEffect } from "react";

function App() {
  const { setcartcount } = useGlobalContext();
  const user = useLoaderData() as UserType;

  useEffect(() => {
    setcartcount(user?.cart ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.cart]);

  return (
    <div className="w-full flex flex-col justify-between min-h-screen h-full">
      <NextUIProvider>
        <Toaster />
        {user && <NavigationBar user={user} />}
        <div className="w-full h-full">
          <Outlet />
        </div>
      </NextUIProvider>
      <FooterComponent />
    </div>
  );
}

export default App;
