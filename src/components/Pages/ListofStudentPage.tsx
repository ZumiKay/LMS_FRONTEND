import { useEffect, useState } from "react";
import "../../style/style.css";
import { useGlobalContext } from "../../types/context.type";
import { ApiRequest } from "../../utilities/helper";
import { ROLE, UserType } from "../../types/user.type";
import TableData from "../Table/TableData";
import { SelectionDataType } from "../../types/helpertype.type";
import RegisterUser from "../Modals/User.model";
import AlertDialog from "../Modals/Alert.modal";
import { Button } from "@nextui-org/react";
import { DepartmentDialog } from "../Modals/Form.modal";

const RoleFilterOption: Array<SelectionDataType> = Object.values(ROLE).map(
  (i) => ({ label: i, value: i })
);

const ModalContainer = ({ reloaddata }: { reloaddata: () => void }) => {
  const { openmodal, globalindex, datatable_select } = useGlobalContext();

  const handleDelete = async (id: number[]) =>
    await ApiRequest({
      url: "/librarian/deleteusers",
      method: "DELETE",
      cookies: true,
      data: {
        uid: id,
      },
    });
  return (
    <>
      {openmodal.registerdep && <DepartmentDialog />}
      {openmodal.register && (
        <RegisterUser
          editId={globalindex === -1 ? undefined : globalindex}
          reload={() => reloaddata()}
        />
      )}
      {openmodal.deleteModal && (
        <AlertDialog
          description="Selected User Will Be Delete"
          onAgree={() =>
            handleDelete(
              datatable_select.size === 0
                ? [globalindex]
                : Array.from(datatable_select).map((i) => Number(i))
            )
          }
          onDelete={() => reloaddata()}
        />
      )}
    </>
  );
};
const ListofStudentPage = () => {
  const ctx = useGlobalContext();
  const [studentdata, setstudent] = useState<Array<UserType>>([]);
  const [reloaddata, setreloaddata] = useState(true);
  const [totalcount, settotalcount] = useState(0);

  useEffect(() => {
    const getStudent = async () => {
      ctx.setloading(true);
      const response = await ApiRequest({
        url: `/librarian/getstudent?ty=user&page=${ctx.page}&limit=${
          ctx.limit
        }${ctx.filterdata.search ? `&search=${ctx.filterdata.search}` : ""}${
          ctx.filterdata.status ? `&role=${ctx.filterdata.status}` : ""
        }`,
        method: "GET",
        cookies: true,
      });
      ctx.setloading(false);
      setstudent(response.data as Array<UserType>);
      settotalcount(response.totalcount ?? 0);
      setreloaddata(false);
    };
    if (reloaddata) getStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.limit, ctx.page, reloaddata, ctx.filterdata.status]);
  return (
    <>
      <ModalContainer reloaddata={() => setreloaddata(true)} />

      <div className="studentlist_container">
        <div className="header_sec">
          <h1 className="text-4xl font-black border-b-4 border-gray-400">
            List of Students
          </h1>
          <div className="headerbtn_sec">
            <Button
              size="lg"
              className="max-w-lg font-bold"
              color="primary"
              onClick={() => ctx.setopenmodal({ register: true })}
            >
              Resgister
            </Button>
            <Button
              size="lg"
              className="max-w-lg font-bold"
              color="primary"
              onClick={() => ctx.setopenmodal({ registerdep: true })}
            >
              Department
            </Button>
          </div>
        </div>
        <div className="table_data">
          <TableData
            filterstatusoption={RoleFilterOption}
            tabledata={studentdata as never}
            type="userlist"
            reloaddata={() => setreloaddata(true)}
            onSearch={() => setreloaddata(true)}
            totaldata={totalcount}
            totalpage={Math.ceil(totalcount / ctx.limit)}
          />
        </div>
      </div>
    </>
  );
};

export default ListofStudentPage;
