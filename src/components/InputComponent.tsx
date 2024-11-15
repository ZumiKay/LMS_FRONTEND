import * as React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/SvgComponent";
import { Input, InputProps } from "@nextui-org/react";

export default function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label="Password"
      size="lg"
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-lg text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-lg text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="max-w-xs"
      {...props}
    />
  );
}
