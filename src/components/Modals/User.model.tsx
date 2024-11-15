import * as React from "react";
import ReactDOM from "react-dom/server";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FacultyType, ROLE, UserType } from "../../types/user.type";
import Selection, { SelectionContainer } from "../Selection";
import DatePickerInput from "../DatePicker";
import { ApiRequest } from "../../utilities/helper";
import toast from "react-hot-toast";
import QrScanner from "../QrCodeComponent";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useShowToast } from "../../config/customHook";
import EmailTemplate from "../Pages/TestUi";
import { useGlobalContext } from "../../types/context.type";
import { SelectionDataType } from "../../types/helpertype.type";

type infotype = "qr" | "manual";
interface GetStudentFromParagonApiType {
  id_number: string;
  profile_url: string;
  name: string;
  department: string;
  faculty: string;
}

const RoleOption: Array<SelectionDataType> = Object.entries(ROLE)
  .filter((i) => i[1] !== ROLE.LIBRARIAN)
  .map((i) => ({ label: i[0], value: i[1] }));

const UserInitial: UserType = {
  firstname: "",
  lastname: "",
  email: "",
  studentID: "",
  phone_number: "",
  role: ROLE.STUDENT,
};
export default function RegisterUser({
  reload,
  editId,
}: {
  reload?: () => void;
  editId?: number;
}) {
  const { openmodal, setopenmodal } = useGlobalContext();
  const [loading, setloading] = React.useState(false);
  const [userdata, setuserdata] = React.useState<UserType>();
  const [departmentdata, setdepartment] = React.useState<FacultyType[]>();
  const [infotype, setinfotype] = React.useState<infotype>("manual");
  const [scan, setscan] = React.useState(false);
  const { ErrorToast, SuccessToast } = useShowToast();

  const handleClose = () => {
    setopenmodal({ register: false });
  };

  //Get Department
  React.useEffect(() => {
    async function GetDeparment() {
      const response = await ApiRequest({
        url: "/librarian/getdepartment",
        method: "GET",
        cookies: true,
      });

      if (response.success) {
        setdepartment(response.data as FacultyType[]);
      }
    }
    GetDeparment();

    return () => {
      setdepartment(undefined);
    };
  }, []);

  React.useEffect(() => {
    async function GetEditData() {
      const response = await ApiRequest({
        url: `/user/getinfo?id=${editId}`,
        method: "GET",
        cookies: true,
        data: { id: editId },
      });

      if (!response.success) {
        ErrorToast("Can't Get User Info");
        return;
      }

      setuserdata(response.data as UserType);
    }

    if (editId) GetEditData();
  }, [editId]);

  const handleSubmit = async (data?: UserType) => {
    const HtmlTemplate = ReactDOM.renderToStaticMarkup(
      <EmailTemplate label="Password" type="register" />
    );

    setloading(true);
    const response = await ApiRequest({
      url: editId ? "/librarian/edituser" : "/librarian/registeruser",
      method: editId ? "PUT" : "POST",
      data: {
        ...data,
        departmentID: data?.department?.id,
        id: editId,
        html: !editId ? HtmlTemplate : undefined,
      },
      cookies: true,
    });
    setloading(false);

    if (!response.success) {
      ErrorToast(`${editId ? "Can't Edit User" : "Can't Register User"}`);
      return;
    }
    //reload User data

    SuccessToast(editId ? "User Updated" : "User Registered");
    setuserdata(UserInitial);
    if (reload) reload();
  };

  const handleScanQrCode = async (val: string) => {
    setloading(true);
    const res = await ApiRequest({
      url: `/librarian/scancard?url=${val}`,
      method: "GET",
      cookies: true,
    });
    setloading(false);

    const response = res.data as GetStudentFromParagonApiType;

    if (!res.success) {
      toast.error("Problem Occured");
      return;
    }

    const [firstname, lastname] = response.name.split(" ");

    setuserdata(
      (prev) =>
        ({
          ...prev,
          firstname,
          lastname,
          department: departmentdata?.find((dep) =>
            dep.departments.some((i) => i.department === response.department)
          ),
          studentID: response.id_number,
        } as UserType)
    );
    setinfotype("manual");
  };

  const handleChangeType = (type: infotype) => setinfotype(type);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setuserdata((prev) => ({ ...prev, [name]: value } as UserType));
  };

  return (
    <Dialog
      open={openmodal.register ?? false}
      onClose={handleClose}
      aria-autocomplete="none"
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (
            !userdata?.firstname ||
            !userdata.lastname ||
            !userdata.studentID ||
            !userdata.email ||
            !userdata.department?.faculty ||
            !userdata.department.id ||
            !userdata.role
          ) {
            ErrorToast("Fill All Required");
            return;
          }

          await handleSubmit(userdata);
        },
      }}
    >
      <DialogTitle>{editId ? "Edit User" : "Register User"}</DialogTitle>
      <DialogContent aria-autocomplete="none">
        <DialogContentText>Please All Required Info</DialogContentText>
        <div className="w-full h-fit flex flex-col gap-y-10">
          {!editId && (
            <div className="selecttypecontainer flex flex-row items-center gap-x-5">
              <div
                onClick={() => handleChangeType("qr")}
                style={
                  infotype === "qr" ? { backgroundColor: "lightgray" } : {}
                }
                className={`w-fit h-[30px] flex justify-center items-center cursor-pointer rounded-lg p-2 bg-blue-500 text-white 
              transition hover:bg-black font-bold ${
                infotype === "qr" ? "bg-black text-white" : ""
              }`}
              >
                Scan
              </div>
              <div
                onClick={() => handleChangeType("manual")}
                style={
                  infotype === "manual" ? { backgroundColor: "lightgray" } : {}
                }
                className={`w-fit h-[30px] flex justify-center items-center cursor-pointer rounded-lg p-2 bg-blue-500 text-white  transition hover:bg-black font-bold`}
              >
                Manually
              </div>
            </div>
          )}
          {infotype === "manual" ? (
            <div className="w-full h-fit flex flex-col items-center gap-y-5">
              {(!editId || (editId && userdata?.role !== ROLE.LIBRARIAN)) && (
                <Select
                  fullWidth
                  selectedKeys={[userdata?.role ?? ""]}
                  label="ROLE"
                  size="md"
                  variant="bordered"
                  onChange={(val) =>
                    setuserdata(
                      (prev) =>
                        ({ ...prev, role: val.target.value } as UserType)
                    )
                  }
                  items={RoleOption}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              )}
              <div className="w-full h-fit flex flex-row items-center gap-x-3">
                <Input
                  type="text"
                  autoComplete="off"
                  label="Firstname"
                  size="sm"
                  variant="underlined"
                  name="firstname"
                  value={userdata?.firstname}
                  onChange={handleChange}
                  isRequired
                />
                <Input
                  type="text"
                  autoComplete="off"
                  label="Lastname"
                  size="sm"
                  variant="underlined"
                  name="lastname"
                  value={userdata?.lastname}
                  onChange={handleChange}
                  isRequired
                />
              </div>
              <div className="w-full h-fit flex flex-row items-center gap-x-3">
                <Input
                  type="text"
                  autoComplete="off"
                  label="Email"
                  size="sm"
                  variant="underlined"
                  value={userdata?.email}
                  name="email"
                  onChange={handleChange}
                  isRequired
                />
                <Input
                  type="text"
                  autoComplete="off"
                  label="ID Card"
                  size="sm"
                  variant="underlined"
                  value={userdata?.studentID}
                  name="studentID"
                  onChange={handleChange}
                  isRequired
                />
              </div>

              {departmentdata &&
                ((editId && userdata?.role !== ROLE.LIBRARIAN) || !editId) && (
                  <>
                    <SelectionContainer
                      label="Faculty *"
                      data={departmentdata.map((fac) => fac.name)}
                      value={
                        userdata
                          ? userdata.department && userdata.department.faculty
                            ? [userdata.department.faculty.name]
                            : undefined
                          : undefined
                      }
                      single
                      onSelect={(val) => {
                        const faculty = departmentdata.find(
                          (i) => i.name === val[0]
                        );

                        if (faculty)
                          setuserdata(
                            (prev) =>
                              ({
                                ...prev,
                                department: {
                                  faculty: {
                                    name: faculty.name,
                                    id: faculty.id,
                                  },
                                },
                              } as UserType)
                          );
                      }}
                    />
                    {userdata?.department?.faculty &&
                      userdata.department.faculty.name && (
                        <Selection
                          required
                          width="100%"
                          selectdata={
                            departmentdata
                              .find(
                                (facutlty) =>
                                  facutlty.name ===
                                  userdata?.department?.faculty?.name
                              )
                              ?.departments.map((dep) => ({
                                label: dep.department ?? "",
                                value: dep.id ? `${dep.id}` : "0",
                              })) ?? []
                          }
                          value={userdata.department.id?.toString()}
                          label="Department"
                          handleChange={(val) => {
                            setuserdata(
                              (prev) =>
                                ({
                                  ...prev,
                                  department: {
                                    ...prev?.department,
                                    id: Number(val.target.value),
                                  },
                                } as UserType)
                            );
                          }}
                        />
                      )}
                  </>
                )}

              <DatePickerInput
                value={userdata?.date_of_birth ?? new Date()}
                label="Date of Birth"
                handleChange={(val) => {
                  setuserdata(
                    (prev) =>
                      ({ ...prev, date_of_birth: val?.toDate() } as UserType)
                  );
                }}
              />

              <Input
                type="tel"
                name="phone_number"
                value={userdata?.phone_number}
                size="sm"
                label="Phone Number"
                variant="underlined"
                onChange={handleChange}
              />
            </div>
          ) : (
            <QrScanner
              scan={scan}
              setscan={setscan}
              loading={loading}
              handleScan={(val) => handleScanQrCode(val)}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          className="max-w-md font-bold"
          color="danger"
          variant="flat"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="max-w-md font-bold"
          color="primary"
          variant="flat"
          isLoading={loading}
        >
          {editId ? "Update" : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
