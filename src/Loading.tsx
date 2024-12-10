import { Backdrop, CircularProgress } from "@mui/material";
import { Skeleton } from "@nextui-org/react";

export default function PageLoading() {
  return (
    <Backdrop open={true} sx={{ zIndex: 200 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export function SliderLoading() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[200px] w-fit ml-[10px] mb-[10px] h-[280px] flex flex-row gap-x-5 overflow-x-auto">
        <Skeleton className="w-[200px] h-full" />
        <Skeleton className="w-[200px] h-full" />
        <Skeleton className="w-[200px] h-full" />
      </div>
    </div>
  );
}

export function RectangleLoading() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[200px] w-fit ml-[10px] mb-[10px] h-[280px] flex flex-row gap-x-5 overflow-x-auto">
        <Skeleton className="w-[250px] h-[200px]" />
        <Skeleton className="w-[250px] h-[200px]" />
        <Skeleton className="w-[250px] h-[200px]" />
      </div>
    </div>
  );
}
