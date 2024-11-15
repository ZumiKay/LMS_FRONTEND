import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import { DepartmentType, FacultyType } from "../../types/user.type";
import { useEffect, useState } from "react";
import { ApiRequest } from "../../utilities/helper";
import { useGlobalContext } from "../../types/context.type";
import { useShowToast } from "../../config/customHook";
import { SelectionContainer } from "../Selection";
import {
  Accordion,
  AccordionItem,
  Badge,
  Chip,
  Input,
} from "@nextui-org/react";

export function DepartmentDialog() {
  const { openmodal, setopenmodal } = useGlobalContext();
  const { ErrorToast, SuccessToast } = useShowToast();
  const [value, setValue] = useState(0);
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState<DepartmentType>();
  const [faculty, setfaculty] = useState<FacultyType[]>();
  const [reloaddata, setreloaddata] = useState(true);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCreateFaculty = async (val: Array<string>, func: () => void) => {
    setloading(true);
    const createreq = await ApiRequest({
      url: "/librarian/createfaculty",
      method: "POST",
      cookies: true,
      data: { name: val },
    });
    setloading(false);

    if (!createreq.success) {
      ErrorToast("Can't Create Faculty");
      return;
    }
    func();
    setreloaddata(true);
  };

  const handleDeleteFaculty = async (val: string) => {
    setloading(true);
    const delreq = await ApiRequest({
      url: "/librarian/deletefaculty",
      method: "DELETE",
      cookies: true,
      data: { name: val },
    });
    setloading(false);

    if (!delreq.success) {
      ErrorToast("Problem Occured");
      return;
    }
    setreloaddata(true);
  };

  useEffect(() => {
    const getFaculty = async () => {
      setloading(true);
      const res = await ApiRequest({
        url: `/librarian/getdepartment?ty=${value === 0 ? "faculty" : "dep"}`,
        method: "GET",
        cookies: true,
      });
      setloading(false);

      if (!res.success) {
        ErrorToast("Problem Occured");
        return;
      }
      setfaculty(res.data as Array<FacultyType>);
      setreloaddata(false);
    };

    if (reloaddata) getFaculty();
  }, [reloaddata, value]);

  const handleClose = () => {
    setopenmodal({ registerdep: false });
  };

  const handleCreate = async () => {
    setloading(true);
    const req = await ApiRequest({
      url: "/librarian/createdepartment",
      method: "POST",
      cookies: true,
      data,
    });
    setloading(false);

    if (!req.success) {
      ErrorToast(req.message ?? "Can't Create Department");
      return;
    }
    SuccessToast("Department Created");
    setdata(undefined);
  };

  return (
    <Dialog open={openmodal.registerdep ?? false} onClose={handleClose}>
      <DialogTitle>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab id={`simple-tab-1`} label="Create" />
          <Tab id={`simple-tab-2`} label="Edit" />
        </Tabs>
      </DialogTitle>
      <DialogContent sx={{ width: "100%" }}>
        {value === 0 ? (
          <div className="w-full h-fit flex flex-col gap-y-5">
            <SelectionContainer
              label="Faculty"
              data={faculty?.map((i) => i.name) ?? []}
              single
              onSelect={(val) =>
                setdata(
                  (prev) =>
                    ({ ...prev, faculty: { name: val[0] } } as DepartmentType)
                )
              }
              create
              onDelete={handleDeleteFaculty}
              customCreateFunction={handleCreateFaculty}
            />

            {data?.faculty && data?.faculty.name && (
              <Input
                fullWidth
                size="md"
                name="department"
                label="Department"
                onChange={(e) => {
                  setdata((prev) => ({ ...prev, department: e.target.value }));
                }}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-fit flex flex-col items-start gap-y-5">
            {loading ? (
              <Skeleton variant="rounded" width={"100%"} height={"50px"} />
            ) : !faculty || faculty.length === 0 ? (
              <p className="text-lg font-normal text-red-400">No Data Found</p>
            ) : (
              <EditDeparmentContainer
                data={faculty}
                reloaddata={() => setreloaddata(true)}
              />
            )}
          </div>
        )}
      </DialogContent>
      {value === 0 && (
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            startIcon={loading && <CircularProgress />}
            type="button"
            onClick={() => handleCreate()}
          >
            Create
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

const EditDeparmentContainer = ({
  data,
  reloaddata,
}: {
  data: Array<FacultyType>;
  reloaddata: () => void;
}) => {
  const { ErrorToast } = useShowToast();
  const [loading, setloading] = useState(false);
  const handleDeleteDeparment = async (id: number) => {
    setloading(true);
    const delreq = await ApiRequest({
      url: "/librarian/deletedepartment",
      method: "DELETE",
      cookies: true,
      data: { id },
    });
    setloading(false);

    if (!delreq.success) {
      ErrorToast("Can't Delete Department");
      return;
    }
    reloaddata();
  };
  return (
    <Accordion>
      {data.map((faculty) => (
        <AccordionItem
          key={faculty.id}
          title={faculty.name}
          aria-label={faculty.name}
        >
          {faculty.departments?.map((dep) => (
            <Badge
              key={dep.id}
              size="lg"
              onClick={() => dep.id && handleDeleteDeparment(dep.id)}
              content={loading ? "Deleting" : "-"}
              color="danger"
            >
              <Chip size="lg" key={dep.id}>
                {dep.department}
              </Chip>
            </Badge>
          ))}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
