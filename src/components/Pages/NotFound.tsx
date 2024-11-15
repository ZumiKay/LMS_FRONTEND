import { Link } from "react-router-dom";
import NotFoundIcon from "../../../public/Image/404-error.png";

export default function NotFound() {
  return (
    <div className="notfound_page w-fit h-screen flex flex-col justify-center items-center">
      <img
        src={NotFoundIcon}
        alt="notFoundIcon"
        className="w-[300px] h-[300px] object-cover"
      />

      <p className="w-full h-fit font-medium text-lg">
        This Page you are looking for might not exist or error is occured. If
        these a mistake please consider contact us by library or email.
      </p>
      <Link className="text-lg font-bold text-blue-400 underline" to={"/"}>
        Back to homepage
      </Link>
    </div>
  );
}
