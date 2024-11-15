import { LinearProgress } from "@mui/material";
import { Button } from "@nextui-org/react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import { useShowToast } from "../config/customHook";

export default function QrScanner({
  handleScan,
  loading,
  scan,
  setscan,
  style,
}: {
  loading?: boolean;
  style?: CSSProperties;
  handleScan: (val: string) => Promise<void>;
  scan: boolean;
  setscan: Dispatch<SetStateAction<boolean>>;
}) {
  const { ErrorToast } = useShowToast();
  const [errormessage, seterrormessage] = useState<string | null>(null);
  return (
    <div
      style={style}
      className="qrscanner_container w-[300px] h-[400px] flex flex-col gap-y-5 items-center"
    >
      {loading && <LinearProgress sx={{ width: "100%" }} />}
      {errormessage && (
        <p className="text-lg font-normal text-red-500">{errormessage}</p>
      )}
      {!scan ? (
        <Scanner
          onScan={async (val) => {
            setscan(true);
            const qrval = val[0].rawValue;
            if (qrval.length === 0) {
              ErrorToast("Invalid QrCode");
              seterrormessage("Please Make Sure QrCode Is Clear");

              return;
            }
            await handleScan(qrval);
          }}
          onError={() => {
            setscan(true);
            ErrorToast("Problem Occured");
          }}
          allowMultiple={false}
        />
      ) : (
        <Button
          fullWidth
          color="warning"
          className="w-full h-[40px] rounded-lg font-bold"
          onClick={() => {
            setscan(false);
            seterrormessage(null);
          }}
          variant="flat"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
