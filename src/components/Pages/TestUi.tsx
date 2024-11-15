export default function EmailTemplate({
  label,
  type,
}: {
  label: string;
  type: "reset" | "register";
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        display: "grid",
        placeItems: "center",
        placeContent: "center",
      }}
    >
      <table
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "450px",
          height: "100%",
          border: 0,
        }}
      >
        <tr>
          <td width={"25%"} align="right">
            <img
              width={"100px"}
              height={"auto"}
              src="https://firebasestorage.googleapis.com/v0/b/sroksre-442c0.appspot.com/o/sideImage%2FLMS_LOGO.svg?alt=media&token=c281429e-6472-42bf-b43e-425ca0e8c3b5"
              alt="logo"
              style={{ display: "block", objectFit: "contain" }}
            />
          </td>

          <td width={"50%"} align="center">
            <p style={{ fontSize: "30px", fontWeight: "bolder" }}>
              {type === "reset" ? "Reset Password" : "Login Information"}
            </p>
          </td>
          <td width={"25%"}></td>
        </tr>
        <tr>
          <td width={"25%"}></td>
          <td width={"50%"} align="left">
            <p style={{ height: "50px", fontSize: "15px", fontWeight: "bold" }}>
              {label}:
            </p>
            <p
              style={{
                fontSize: "20px",
                minHeight: "50px",
                fontWeight: "800",
              }}
            >
              :code:
            </p>
            {type === "reset" && (
              <p style={{ minHeight: "50px" }}>
                If you did not request to reset your password, it is safe to
                disregard this message
              </p>
            )}
            <p style={{ minHeight: "50px", fontSize: "12px" }}>
              This is an automatic email. Replies to this email are not
              monitored.
            </p>

            <div
              style={{
                width: "100%",
                height: "2px",
                marginBottom: "10px",
                backgroundColor: "black",
              }}
            ></div>

            <p style={{ fontSize: "12px" }}>@2024 TSU. Paragon.U Library.</p>
            <p style={{ fontSize: "12px" }}>
              Paragon Internation University, ToulKork, PhnomPenh, Cambodia
            </p>
          </td>
          <td width={"25%"}></td>
        </tr>
      </table>
    </div>
  );
}
