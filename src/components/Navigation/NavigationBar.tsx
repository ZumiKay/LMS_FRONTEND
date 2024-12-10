import { useEffect, useState } from "react";
import "../../style/style.css";
import Logo from "../../Image/LMS_LOGO.svg";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import menuimg from "../../Image/LMS_MENU.svg";
import { useGlobalContext } from "../../types/context.type";
import { ApiRequest, convertToPascalCase } from "../../utilities/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { ROLE, UserType } from "../../types/user.type";
import { MenuItem } from "./Component";
import { Badge, Button, Progress } from "@nextui-org/react";
import SettingModal from "../Modals/Setiing.modal";
import { useClickOutside } from "../../config/customHook";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const NavigationBar = ({ user }: { user: UserType }) => {
  const ctx = useGlobalContext();
  const [change, setchange] = useState(false);
  const [openmenu, setopenmenu] = useState(false);
  const [opensetting, setopensetting] = useState(false);
  const [openprofile, setopenprofile] = useState(false);
  const [hideprofile, sethideprofile] = useState(false);
  const [loading, setloading] = useState(false);
  const [toastid, settoastid] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => setopenmenu(!openmenu);
  const profref = useClickOutside(() => setopenprofile(false));
  const sidemenuref = useClickOutside(() => setopenmenu(false));

  useEffect(() => {
    const handleresize = () => {
      if (window.innerWidth > 800) {
        setchange(true);
      } else {
        setchange(false);
      }
      if (window.innerWidth < 380) {
        sethideprofile(true);
      } else {
        sethideprofile(false);
      }
    };
    handleresize();
    window.addEventListener("resize", handleresize);
    return () => {
      window.removeEventListener("resize", handleresize);
    };
  }, []);
  const handleLogout = async () => {
    if (toastid) toast.dismiss(toastid);

    setloading(true);
    const request = await ApiRequest({
      url: "/user/logout",
      method: "POST",
      data: {
        token: localStorage.getItem(import.meta.env.VITE_REFRESHTOKEN_COOKIE),
      },
      cookies: true,
    });
    setloading(false);
    if (!request.success) {
      settoastid(toast.error("Can't Logout"));
      return;
    }
    localStorage.removeItem(import.meta.env.VITE_REFRESHTOKEN_COOKIE);
    localStorage.removeItem(import.meta.env.VITE_ACCESSTOKEN_COOKIE);
    toast.success("Signing Out");
    window.location.reload();
  };

  return change ? (
    <>
      <div className={"NavBar_container"}>
        <div className="first_sec">
          <img
            ref={sidemenuref as never}
            id="menu"
            style={openmenu ? { backgroundColor: "#e2e2e2" } : {}}
            onClick={handleClick}
            src={menuimg}
            alt="svg_img"
            className="menu_btn"
          />
          <img
            onClick={() => navigate("/")}
            src={Logo}
            alt="png_img"
            className="logo"
          />
        </div>
        <div className="second_sec">
          <i className="fa-solid fa-magnifying-glass" id="search_icon"></i>
          <input
            className="search"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/", { replace: true });
            }}
            value={ctx.search}
            onBlur={() => ctx.setisSearch(true)}
            onChange={({ target }) => ctx.setsearch(target.value)}
            type="text"
            disabled={!user}
            placeholder="Search by Title | Author | ISBN"
          />
        </div>

        <div className="third_sec">
          {user?.role === ROLE.STUDENT && location.pathname !== "/bucket" && (
            <NavLink
              to={"/bucket"}
              className={"text-black hover:text-gray-300"}
            >
              <Badge content={ctx.cartcount} variant="solid" color="danger">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  fontSize={25}
                  className="transition-transform hover:-translate-y-1 active:-translate-y-1"
                />
              </Badge>
            </NavLink>
          )}
          {user && (
            <div ref={profref as never} className="profile_sec">
              <p
                onClick={() => {
                  setopenprofile(!openprofile);
                }}
                className="Account_Detail"
              >
                {user?.role ? convertToPascalCase(user.role) : ""}
              </p>
            </div>
          )}

          {openprofile && (
            <div ref={profref as never} className="drop_down">
              <Link className="link_page text-black" to={"/profile"}>
                <i className="fa-solid fa-user fa-xl"></i>
                <p>Profile</p>
              </Link>

              <div
                className="link_page cursor-pointer"
                onClick={() => {
                  setopensetting(true);
                }}
              >
                <i className="fa-solid fa-gear fa-xl"></i>
                <p>Settings</p>
              </div>

              <Button
                className="w-[70%] h-[40px]"
                color="danger"
                isLoading={loading}
                variant="bordered"
                onClick={handleLogout}
              >
                LogOut
              </Button>
            </div>
          )}
        </div>

        {opensetting && (
          <SettingModal
            open={opensetting}
            onPageChange={(val) => setopensetting(val)}
            reloaddata={() => navigate(".", { replace: true })}
          />
        )}
        {openmenu && (
          <MenuItem
            ref={sidemenuref}
            user={user}
            open={openmenu}
            setopen={setopenmenu}
          />
        )}
      </div>
      {ctx.loading && (
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="w-full"
        />
      )}
    </>
  ) : (
    <div className={"NavBar_container"}>
      <div className="first_sec">
        <img
          id="menu"
          style={openmenu ? { opacity: ".5" } : {}}
          onClick={() => {
            setopenmenu(true);
          }}
          src={menuimg}
          alt="svg_img"
          className="menu_btn"
        />
        {openmenu && (
          <MenuItem user={user} open={openmenu} setopen={setopenmenu} />
        )}
      </div>
      <div
        className="second_sec"
        style={hideprofile ? { width: "100%", alignItems: "flex-end" } : {}}
      >
        <img
          onClick={() => navigate("/", { replace: true })}
          style={{ width: "90px" }}
          src={Logo}
          alt="png_img"
          className="logo"
        />
      </div>

      <div
        className="third_sec"
        style={hideprofile ? { width: "10%", backgroundColor: "black" } : {}}
      >
        {user?.role === ROLE.STUDENT &&
          (location.pathname === "/" ||
            location.pathname.includes("/book")) && (
            <NavLink
              to={"/bucket"}
              className={"text-black hover:text-gray-300"}
            >
              <Badge content={ctx.cartcount} variant="solid" color="danger">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  fontSize={25}
                  className="transition-transform hover:-translate-y-1 active:-translate-y-1"
                />
              </Badge>
            </NavLink>
          )}
      </div>
    </div>
  );
};
export default NavigationBar;
