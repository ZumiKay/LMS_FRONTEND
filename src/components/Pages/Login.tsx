import { FormEvent, useState } from "react";
import "../../style/style.css";
import { LoginType } from "../../types/user.type";
import { ApiRequest } from "../../utilities/helper";
// import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import ReactCodeInput from "react-code-input";
import Logo1 from "../../Image/Logo1.png";
import { Button, Input } from "@nextui-org/react";
import EmailTemplate from "./TestUi";
import "react-code-input/styles/style.css";
import PasswordInput from "../InputComponent";
import { useShowToast } from "../../config/customHook";

const Login = () => {
  const [loading, setloading] = useState(false);
  // const navigate = useNavigate();
  const [reset, setreset] = useState(false);
  const [isrequest, setisrequest] = useState(false);
  const [isChange, setisChange] = useState(false);
  const [data, setdata] = useState<LoginType>({
    code: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const { ErrorToast } = useShowToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isChange) {
      if (!data.password || !data.confirmpassword) {
        ErrorToast("Missing Requried Field");
        return;
      }
      if (data.password !== data.confirmpassword) {
        ErrorToast("Invalid Confirm Password");
        return;
      }
    }

    const requesturl = isChange
      ? "/user/forgotpassword"
      : !reset
      ? "/user/login"
      : "/user/forgotpassword";

    const submitdata = {
      email: data.email,
      password: data.password,
      html: renderToStaticMarkup(
        <EmailTemplate label="Your Reset Password Link" type="reset" />
      ),
      type: isrequest ? "Verify" : "Request",
      ...(isrequest ? { code: data.code } : {}),
    };

    setloading(true);
    const request = await ApiRequest({
      url: requesturl,
      method: "POST",
      data: isChange
        ? {
            email: data.email,
            password: data.password,
            type: "Change",
          }
        : submitdata,
      cookies: true,
      refreshToken: false,
    });
    setloading(false);

    if (!request.success) {
      ErrorToast(request.message ?? "Error Occured");
      return;
    }

    if (isChange) {
      window.location.reload();
      return;
    }

    if (!reset) {
      // navigate("/profile", { replace: true });
      // window.location.reload();
    } else {
      setisrequest(true);
      if (isrequest) {
        setisChange(true);
      }
    }
  };

  return (
    <div className="Login_container">
      <form className="Login_form" onSubmit={handleSubmit}>
        <img
          src={Logo1}
          alt="logo"
          loading="lazy"
          className="logo w-[400px] h-auto object-cover"
        />

        {isChange ? (
          <>
            <p className="text-lg font-bold">
              All Login Session Will Be Logged Out
            </p>
            <PasswordInput
              className="w-full"
              label="New Password"
              name="password"
              onChange={handleChange}
              required
            />
            <PasswordInput
              className="w-full"
              label="Confirm Password"
              onChange={handleChange}
              name="confirmpassword"
              required
            />
          </>
        ) : !reset ? (
          <>
            <Input
              type={"text"}
              id="email"
              className="text-black"
              name="email"
              label={"Email / ID"}
              onChange={handleChange}
              size="lg"
              required
            />
            <PasswordInput
              className="w-full"
              name="password"
              label={"Password"}
              onChange={handleChange}
              required
            />
          </>
        ) : isrequest ? (
          <ReactCodeInput
            name="code"
            inputMode="numeric"
            fields={6}
            onChange={(e) => {
              setdata((prev) => ({ ...prev, code: e }));
            }}
          />
        ) : (
          <Input
            type={"text"}
            id="email"
            name="email"
            label={"Email / ID"}
            labelPlacement="outside"
            onChange={handleChange}
            size="lg"
            required
          />
        )}
        <Button
          type="submit"
          isLoading={loading}
          variant="flat"
          className="bg-[#192A56] font-bold text-white"
        >
          {reset || isChange ? "Confirm" : "Login"}
        </Button>
        {!isChange && (
          <p onClick={() => setreset(!reset)} className="forgot">
            {!reset ? `Forgot Password?` : "Has an account?"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
