import { Link, useLocation } from "react-router-dom";
import { forwardRef, useCallback, useState } from "react";
import { ROLE, UserType } from "../../types/user.type";
import { MenuItemList } from "./Asset";
import "../../style/style.css";
import ReportModal from "../Modals/Report.modal";

interface MenuItemType {
  open: boolean;
  setopen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType;
}
export const MenuItem = forwardRef((props: MenuItemType, ref) => {
  const { pathname } = useLocation();
  const [openreport, setopenreport] = useState<boolean>(false);

  const RenderItem = useCallback(
    () =>
      MenuItemList.filter((i) => {
        if (props.user?.role === ROLE.LIBRARIAN) return i.isADMIN;
        if (props.user?.role === ROLE.HEADDEPARTMENT)
          return i.isHD || (!i.isADMIN && !i.isHD);
        return !i.isADMIN && !i.isHD;
      }),
    [props.user?.role]
  );

  return (
    <div
      ref={ref as never}
      className={props.open ? "MenuItem Menu_Animated" : "MenuItem"}
    >
      <div className="menu_sec">
        {RenderItem().map((item, index) => (
          <Link
            key={index}
            className={
              pathname === item.path ? "link_page linkselected" : "link_page"
            }
            to={item.path}
          >
            {item.icon}
            <div className="w-full h-fit text-lg font-bold">{item.page}</div>
          </Link>
        ))}

        {[ROLE.LIBRARIAN, ROLE.HEADDEPARTMENT].includes(props.user?.role) && (
          <>
            <div
              onClick={() => setopenreport(true)}
              className={openreport ? "link_page linkselected" : "link_page"}
            >
              <i className="fa-regular fa-calendar-check fa-xl"></i>
              <div className="w-full h-fit text-lg font-bold">
                EXPORT REPORT
              </div>
            </div>
            {openreport && (
              <ReportModal
                open={openreport}
                close={() => setopenreport(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});
