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
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        padding: "20px 0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderCollapse: "collapse",
          border: "1px solid #dddddd",
        }}
      >
        <tr>
          <td style={{ padding: "20px", textAlign: "center" }}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/sroksre-442c0.appspot.com/o/sideImage%2FLMS_LOGO.svg?alt=media&token=c281429e-6472-42bf-b43e-425ca0e8c3b5"
              alt="logo"
              width="100"
              height="100"
              style={{
                display: "block",
                margin: "0 auto",
                objectFit: "contain",
              }}
            />
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "20px 0 10px",
              }}
            >
              {type === "reset" ? "Reset Password" : "Login Information"}
            </h1>
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "20px",
              textAlign: "left",
              fontSize: "15px",
              color: "#333333",
            }}
          >
            <p style={{ fontWeight: "bold", margin: "0 0 10px" }}>{label}:</p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "800",
                margin: "0 0 10px",
                color: "#333333",
              }}
            >
              :code:
            </p>
            {type === "reset" && (
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  margin: "0 0 20px",
                  color: "#666666",
                }}
              >
                If you did not request to reset your password, you can safely
                disregard this message.
              </p>
            )}
            <p
              style={{
                fontSize: "12px",
                color: "#666666",
                lineHeight: "1.5",
                margin: "0 0 20px",
              }}
            >
              This is an automatic email. Replies to this email are not
              monitored.
            </p>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "10px 20px", textAlign: "center" }}>
            <hr
              style={{
                border: "0",
                height: "1px",
                backgroundColor: "#dddddd",
                margin: "10px 0",
              }}
            />
            <p style={{ fontSize: "12px", color: "#666666", margin: "0" }}>
              ©2024 TSU. Paragon.U Library.
            </p>
            <p style={{ fontSize: "12px", color: "#666666", margin: "0" }}>
              Paragon International University, ToulKork, PhnomPenh, Cambodia
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
}
