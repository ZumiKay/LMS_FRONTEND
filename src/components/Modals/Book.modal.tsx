import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import { BookType, CategoyType } from "../../types/book.type";
import DatePickerInput from "../DatePicker";
import { ApiRequest, UploadImage } from "../../utilities/helper";
import { CircularProgress } from "@mui/material";
import { useGlobalContext } from "../../types/context.type";
import { SelectionContainer } from "../Selection";
import { useShowToast } from "../../config/customHook";
import { PutBlobResult } from "@vercel/blob";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreateBookInitailize = {
  ISBN: [{ type: "other", identifier: "" }],
  title: "",
  description: "",
  author: [""],
};

export default function CreateBook({
  reload,
  editID,
}: {
  reload: () => void;
  editID?: number;
}) {
  const ctx = useGlobalContext();
  const [cover_img, setcover_img] = useState<File>();
  const [selectedcate, setselectedcate] = useState<string[]>();
  const { ErrorToast, SuccessToast } = useShowToast();
  const [reloadcate, setreloadcate] = useState(true);

  const [data, setdata] =
    useState<
      Pick<
        BookType,
        | "ISBN"
        | "title"
        | "description"
        | "cover_img"
        | "author"
        | "publisher_date"
      >
    >(CreateBookInitailize);
  const [loading, setloading] = useState(false);
  const [cate, setcate] = useState<CategoyType[]>();

  const handleClose = () => {
    if (ctx.globalindex !== -1) ctx.setglobalindex(-1);
    ctx.setopenmodal((prev) => ({ ...prev, register: false }));
  };

  useEffect(() => {
    const getCate = async () => {
      const response = await ApiRequest({
        url: "/librarian/getcategory",
        method: "GET",
        cookies: true,
      });

      if (response.success) {
        setcate(response.data as Array<CategoyType>);
      }

      setreloadcate(false);
    };

    if (reloadcate) getCate();
  }, [reloadcate]);

  useEffect(() => {
    const asyncFetchEditData = async () => {
      setloading(true);
      const request = await ApiRequest({
        url: `/getallbook?type=id&id=${editID}`,
        method: "GET",
      });
      setloading(false);

      if (request.success) {
        const value = request.data as BookType;
        setdata(value);
        setselectedcate(value.categories.map((i) => i.name));
      } else {
        ErrorToast("Error Fetch Data", { duration: 2000 });
      }
    };

    if (editID) {
      asyncFetchEditData();
    }
  }, [editID]);

  const handleSubmit = async () => {
    if (
      !editID &&
      (!cover_img ||
        !data?.ISBN ||
        !data.publisher_date ||
        !data.title ||
        !data.author ||
        !selectedcate)
    ) {
      ErrorToast("Please Fill All Required");
      return;
    }

    setloading(true);
    //Update Cover Image

    let uploadImage: null | PutBlobResult = null;
    if (cover_img) {
      uploadImage = await UploadImage(cover_img);

      if (!uploadImage) {
        ErrorToast("Can't Upload Image");
        setloading(false);
        return;
      }
    }

    const request = await ApiRequest({
      url: `/librarian/${editID ? "editbook" : "registerbook"}`,
      method: editID ? "PUT" : "POST",
      cookies: true,
      data: {
        ...data,
        ...(selectedcate && {
          categories: cate?.filter((i) => selectedcate.includes(i.name)),
        }),
        ...(uploadImage && { cover_img: uploadImage.downloadUrl }),
      },
    });
    setloading(false);
    if (!request.success) {
      ErrorToast(request.message ?? "Error Occured");
      return;
    }
    //reset
    setselectedcate(undefined);
    if (!editID) setdata(CreateBookInitailize);
    // //Reload Book Data
    reload();
    SuccessToast(editID ? "Book Updated" : "Book Created");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setdata(
      (prev) =>
        ({
          ...prev,
          [name]:
            name === "ISBN"
              ? [
                  {
                    type: "other",
                    identifier: value,
                  },
                ]
              : name === "author"
              ? value.split(",").map((item) => item.trim())
              : value,
        } as BookType)
    );
  };

  return (
    <Dialog
      open={ctx.openmodal.register ?? false}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          await handleSubmit();
        },
      }}
    >
      <div className="w-full h-fit overflow-x-hidden">
        <DialogTitle sx={{ width: "100vw" }}>
          <p className="font-bold text-2xl">Register Book </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <div className="w-full h-fit flex flex-col gap-y-10 items-start justify-start">
            {data?.cover_img && (
              <img
                src={data?.cover_img}
                className="w-[200px] h-[300px] object-cover"
                alt="cover_img"
              />
            )}
            <Button
              component="label"
              sx={{ marginTop: "10px" }}
              role={undefined}
              variant="contained"
              color="warning"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              {!editID ? "Upload Image" : "Edit Image"}
              <VisuallyHiddenInput
                type="file"
                accept={"image/png, image/jpeg, image/gif"}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setcover_img(file);
                    setdata(
                      (prev) => ({ ...prev, cover_img: url } as BookType)
                    );
                  }
                }}
              />
            </Button>
            {cate && (
              <SelectionContainer
                data={cate.map((i) => i.name)}
                label="Categories"
                create
                reloaddata={() => setreloadcate(true)}
                value={selectedcate}
                onSelect={(val) => setselectedcate(val)}
              />
            )}
            {(editID ? data.ISBN.some((i) => i.type === "other") : !editID) && (
              <TextField
                autoFocus
                required
                name="ISBN"
                label="ISBN"
                type="text"
                value={
                  data
                    ? data.ISBN &&
                      data?.ISBN.find((i) => i.type === "other")?.identifier
                    : undefined
                }
                fullWidth
                onChange={handleChange}
              />
            )}
            <TextField
              autoFocus
              required
              name="title"
              label="Title"
              value={data?.title}
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              id="outlined-textarea"
              label="Description"
              placeholder="Description"
              name="description"
              value={data?.description}
              onChange={handleChange}
              multiline
              fullWidth
            />
            <TextField
              id="outlined-textarea"
              label="Author"
              placeholder="Author (Seperate by commas ',')"
              value={data && data.author && data.author.join(",")}
              name="author"
              onChange={handleChange}
              multiline
              fullWidth
            />

            <DatePickerInput
              label="Publisher Date"
              value={data.publisher_date}
              handleChange={(value) => {
                setdata(
                  (prev) =>
                    ({ ...prev, publisher_date: value?.toDate() } as BookType)
                );
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" startIcon={loading && <CircularProgress />}>
            {editID ? "Update" : "Register"}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
