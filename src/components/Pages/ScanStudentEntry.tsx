import * as React from "react";
import "../../style/style.css";
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import ResponsiveDialog from "../Modals/Detail.modal";
import { UserType } from "../../types/user.type";
import QrScanner from "../QrCodeComponent";
import { SelectionDataType } from "../../types/helpertype.type";
import Selection from "../Selection";
import { ApiRequest } from "../../utilities/helper";
import toast from "react-hot-toast";
import { BorrowBookType } from "../../types/book.type";
import { useGlobalContext } from "../../types/context.type";
import { Button } from "@nextui-org/react";

const ScanType: SelectionDataType[] = [
  {
    label: "Scan",
    value: "scan",
  },
  {
    label: "Manually",
    value: "manually",
  },
];

interface TrackPageProps {
  tracktype: "entry" | "borrowbook";
}

const TrackPage = ({ tracktype }: TrackPageProps) => {
  const { openmodal, setopenmodal } = useGlobalContext();
  const [scanned, setscan] = React.useState(false);
  const [studentdata, setdata] = React.useState<UserType | BorrowBookType>();
  const [type, settype] = React.useState<"scan" | "manually">("scan");
  const [loading, setloading] = React.useState(false);
  const [reloaddata, setreloaddata] = React.useState(false);
  const [fetchid, setfetchid] = React.useState<string | null>(null);

  const trackentry = async (data: string) => {
    setloading(true);
    const request = await ApiRequest({
      url: "/librarian/scanentry",
      method: "POST",
      data: { url: data },
      cookies: true,
    });
    setloading(false);
    if (!request.success) {
      toast.error(request.message ?? "Error Occured");
      return;
    }
    setdata(request.data as UserType);
    setopenmodal({ detailModal: true });
  };

  const returnbook = async (borrow_id: string) => {
    setloading(true);
    const request = await ApiRequest({
      url: "/librarian/scanborrowbook" + `?bid=${borrow_id}`,
      method: "GET",
      cookies: true,
    });
    setloading(false);
    if (!request.success) {
      toast.error(request.message ?? "Error Occured");
      return;
    }

    setdata(request.data as BorrowBookType);
    setopenmodal({ detailModal: true });

    if (reloaddata) setreloaddata(false);
  };

  React.useEffect(() => {
    if (fetchid && reloaddata) returnbook(fetchid);
  }, [reloaddata]);

  const onNewScanResult = async (data: string) => {
    if (data) {
      setfetchid(data);
      if (tracktype === "entry") {
        await trackentry(data);
      } else {
        //Scan Return Book
        await returnbook(data);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(data.entries()) as { id: string };
    await onNewScanResult(formJson.id);
  };

  return (
    <div className="scanentry_container">
      <div className="scan_instruction">
        <Selection
          width="100%"
          selectdata={ScanType}
          value={type}
          label="Choose Type"
          handleChange={({ target }) => settype(target.value as never)}
        />
        {tracktype === "entry" ? (
          <>
            <h1>Scan Student Entry</h1>

            {type === "scan" && (
              <p className="text-xl text-red-500 font-bold">
                {scanned
                  ? "Student ID Scanned"
                  : "Place StudentID QR In The Red Box"}
              </p>
            )}
          </>
        ) : (
          <>
            {type === "scan" && (
              <>
                <h1>Scan Pickup QR CODE</h1>
                <p className="mt-10 text-red-500 font-bold">
                  {scanned
                    ? "QR CODE Scanned"
                    : "Place The Pickup QR CODE In The Red Box"}
                </p>
              </>
            )}
          </>
        )}
      </div>
      {type === "scan" ? (
        <>
          {scanned && (
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}

          <div className="qrcode_reader w-full h-full">
            <QrScanner
              style={{ width: "100%", height: "100%" }}
              scan={scanned}
              setscan={setscan}
              handleScan={(val) => onNewScanResult(val)}
            />
          </div>
        </>
      ) : (
        <form
          className="track_manually flex flex-col gap-y-5"
          onSubmit={handleSubmit}
        >
          {loading && (
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          <TextField
            type="text"
            name="id"
            placeholder={
              tracktype === "entry"
                ? "ID Card Number"
                : "BorrowID or ID Card Number"
            }
            required
            fullWidth
          />
          <Button
            isLoading={loading}
            fullWidth
            type="submit"
            variant="bordered"
            color="primary"
          >
            ENTER
          </Button>
        </form>
      )}
      <ResponsiveDialog
        open={openmodal.detailModal ?? false}
        type={tracktype === "entry" ? "scanentry" : "scanborrowedbook"}
        data={studentdata as never}
        setscan={setscan}
        close={() => {
          setopenmodal({ detailModal: false });
        }}
        reloaddata={() => setreloaddata(true)}
      />
    </div>
  );
};

export default TrackPage;
