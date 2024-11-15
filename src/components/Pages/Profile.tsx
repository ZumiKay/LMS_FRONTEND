import { useEffect, useState } from "react";
import "../../style/style.css";
import { UserType } from "../../types/user.type";
import { ApiRequest } from "../../utilities/helper";
import toast from "react-hot-toast";
import { Backdrop, CircularProgress } from "@mui/material";
import { useLoaderData } from "react-router-dom";

const Profile = () => {
  const data = useLoaderData() as UserType;
  const [resize, setresize] = useState(false);
  const [loading, setloading] = useState(false);
  const [userinfo, setuserinfo] = useState<UserType>();
  useEffect(() => {
    const handleresize = () => {
      if (window.innerWidth < 768) {
        setresize(true);
      } else {
        setresize(false);
      }
    };
    handleresize();
    window.addEventListener("resize", handleresize);

    return () => window.removeEventListener("resize", handleresize);
  }, []);

  useEffect(() => {
    let toastid = "";
    async function GetUserInfo() {
      setloading(true);
      const request = await ApiRequest({
        url: "/user/getinfo",
        method: "GET",
        cookies: true,
      });
      setloading(false);
      if (request.success) {
        setuserinfo(request.data as UserType);
        return;
      }

      toastid = toast.error("Error Connection");
      return;
    }

    if (data) GetUserInfo();

    return () => toast.dismiss(toastid);
  }, []);
  return (
    <div className="profile_page">
      <h1>Account Informations</h1>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {resize ? (
        <table className="profile_table">
          <tbody>
            {userinfo?.firstname && (
              <>
                <tr>
                  <th>Firstname: </th>
                  <td>{userinfo.firstname}</td>
                </tr>
                <tr>
                  <th>Lastname: </th>
                  <td>{userinfo?.lastname}</td>
                </tr>
              </>
            )}
            <tr>
              <th>ID Card: </th>
              <td>{userinfo?.studentID}</td>
            </tr>
            <tr>
              <th>Department: </th>
              <td>
                {userinfo?.department
                  ? userinfo.department.department
                  : "Library"}
              </td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{userinfo?.phone_number}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{userinfo?.email}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="profile_table">
          <tbody>
            {userinfo?.firstname && (
              <>
                <tr>
                  <th>Firstname: </th>
                  <td>{userinfo.firstname}</td>
                </tr>
                <tr>
                  <th>Lastname: </th>
                  <td>{userinfo?.lastname}</td>
                </tr>
              </>
            )}

            <tr>
              <th>ID Card: </th>
              <td>{userinfo?.studentID}</td>

              <th>Department: </th>
              <td>
                {userinfo?.department
                  ? userinfo.department.department
                  : "Library"}
              </td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{userinfo?.phone_number}</td>
              <th>Email</th>
              <td>{userinfo?.email}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;
