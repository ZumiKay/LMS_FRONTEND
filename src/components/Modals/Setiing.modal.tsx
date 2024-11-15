import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import { ApiRequest } from "../../utilities/helper";
import toast from "react-hot-toast";
import PasswordInput from "../InputComponent";
import DatePickerInput from "../DatePicker";
import { UserType } from "../../types/user.type";

const EditItems = [
  { label: "Your Info", value: "userinfo" },

  {
    label: "Change Password",
    value: "password",
  },
];

interface ChangePasswordType {
  password: string;
  newpassword: string;
}
export default function SettingModal({
  open,
  onPageChange,
  reloaddata,
}: {
  open: boolean;
  onPageChange: (val: boolean) => void;
  reloaddata?: () => void;
}) {
  const [loading, setloading] = useState(false);
  const [toastid, settoastid] = useState<string | undefined>();
  const [isDateOpen, setisDateOpen] = useState(false);
  const [tab, settab] = useState<"password" | "userinfo">("userinfo");
  const [user, setuser] = useState<UserType>();

  useEffect(() => {
    const getUser = async () => {
      setloading(true);
      const response = await ApiRequest({
        url: "/user/getinfo",
        method: "GET",
        cookies: true,
      });
      setloading(false);
      if (response.success) {
        setuser(response.data as UserType);
      }
    };

    getUser();
  }, []);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(
      formData.entries()
    ) as unknown as ChangePasswordType;

    if (toastid) {
      toast.dismiss(toastid);
      settoastid(undefined);
    }

    setloading(true);
    const changereq = await ApiRequest({
      url: "/user/edituser",
      method: "PUT",
      cookies: true,
      data: {
        edittype: "Password",
        password: formJson.password,
        newpassword: formJson.newpassword,
      },
    });
    setloading(false);

    if (!changereq.success) {
      settoastid(
        toast.error(changereq.message ?? "Error Occured", { duration: 1000 })
      );
      return;
    }
    toast.success("Password Updated");
    e.currentTarget.reset();

    if (reloaddata) reloaddata();
  };
  return (
    <Modal
      className="z-[199]"
      isOpen={open}
      onOpenChange={isDateOpen ? undefined : onPageChange}
      size="4xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Setting</ModalHeader>
            <ModalBody>
              <div className="w-full h-fit flex flex-row items-start gap-x-3">
                <Tabs
                  isVertical
                  onSelectionChange={(val) => {
                    settab(val as never);
                  }}
                >
                  {EditItems.map((item) => (
                    <Tab
                      className="w-full h-fit"
                      key={item.value}
                      title={item.label}
                    />
                  ))}
                </Tabs>
                {tab === "password" ? (
                  <form
                    onSubmit={handleSubmit}
                    className="w-full h-fit flex flex-col items-start gap-y-3"
                  >
                    <PasswordInput
                      className="w-full"
                      required
                      name="password"
                    />
                    <PasswordInput
                      required
                      className="w-full "
                      name="newpassword"
                      label={"New Password"}
                    />
                    <ul className="passwordvalidate_container list-item list-disc">
                      <li>8 Character</li>
                      <li>Must contain a number or sepecial </li>
                    </ul>
                    <div className="w-full h-fit flex flex-row gap-x-5">
                      <Button
                        type="submit"
                        isLoading={loading}
                        color="primary"
                        className="w-[50%]"
                      >
                        Confirm
                      </Button>
                      <Button
                        color="danger"
                        className="w-[50%]"
                        onClick={() => onClose()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : tab === "userinfo" ? (
                  user && (
                    <EditUserInfo
                      setDateOpen={setisDateOpen}
                      loading={loading}
                      setloading={setloading}
                      user={user}
                      reloaddata={reloaddata}
                      toastid={toastid}
                      settoastid={settoastid}
                    />
                  )
                ) : (
                  <></>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const EditUserInfo = ({
  user,
  reloaddata,
  loading,
  setDateOpen,
  setloading,
  toastid,
  settoastid,
}: {
  user: UserType;
  reloaddata?: () => void;
  loading: boolean;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
  setDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toastid?: string;
  settoastid: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [data, setdata] = useState<
    Pick<UserType, "date_of_birth" | "phone_number" | "password">
  >({ date_of_birth: user.date_of_birth, phone_number: user.phone_number });

  const handleUpdate = async () => {
    if (!data.password) {
      toast.error("Password Required");
      return;
    }
    let toost = "";

    if (toastid) {
      toast.dismiss(toastid);
      settoastid(undefined);
    }

    setloading(true);
    const changereq = await ApiRequest({
      url: "/user/edituser",
      method: "PUT",
      cookies: true,
      data: {
        edittype: "other",
        dateofbirth: data.date_of_birth,
        phonenumber: data.phone_number,
        password: data.password,
      },
    });
    setloading(false);

    if (!changereq.success) {
      toost = toast.error("Can't Update");
      settoastid(toost);
      return;
    }
    toost = toast.success("Info Updated");
    settoastid(toost);
    if (reloaddata) reloaddata();
  };
  return (
    <div className="w-full h-fit flex flex-col items-start gap-y-5">
      <div
        onMouseEnter={() => setDateOpen(true)}
        onMouseLeave={() => setDateOpen(false)}
      >
        <DatePickerInput
          value={data.date_of_birth}
          label="Date of Birth"
          handleChange={(val) => {
            setdata((prev) => ({
              ...prev,
              date_of_birth: val ? val?.toDate() : undefined,
            }));
          }}
        />
      </div>
      <Input
        value={data.phone_number}
        onChange={(e) =>
          setdata((prev) => ({ ...prev, phone_number: e.target.value }))
        }
        type="number"
        name="phonenumber"
        label="Phonenumber"
        placeholder="phone"
        labelPlacement="outside"
        size="lg"
      />

      <PasswordInput
        onChange={(e) =>
          setdata((prev) => ({ ...prev, password: e.target.value }))
        }
        label={""}
        size="sm"
        placeholder="Password"
      />

      <Button
        isLoading={loading}
        onClick={() => handleUpdate()}
        color="primary"
        size="sm"
      >
        Confirm
      </Button>
    </div>
  );
};
