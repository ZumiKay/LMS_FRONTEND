import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Pages/Login.tsx";
import ErrorPage from "./components/Pages/Error.tsx";
import Profile from "./components/Pages/Profile.tsx";
import PageLoading from "./Loading.tsx";
import CheckoutPage from "./components/Pages/CheckoutPage.tsx";
import Home from "./components/Pages/Home.tsx";
import ListofBorrowedbook from "./components/Pages/ListofBorrowedbook.tsx";
import ListofBook from "./components/Pages/ListofBook.tsx";
import TrackPage from "./components/Pages/ScanStudentEntry.tsx";
import SummaryStudentInfopage from "./components/Pages/SummaryStudentInfo_page.tsx";
import ListofStudentPage from "./components/Pages/ListofStudentPage.tsx";
import CheckRoleRoute, { LoginRoute } from "./middleware/CheckRoleRoute.tsx";
import { ROLE } from "./types/user.type.ts";
import BookDetailPage from "./components/Pages/BookDetail_page.tsx";
import { sessionLoader } from "./utilities/helper.ts";
import Allcontext from "./config/context.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: sessionLoader,
    children: [
      {
        path: "",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute>
            <Home />
          </CheckRoleRoute>
        ),
      },
      {
        path: "login",
        loader: sessionLoader,
        element: (
          <LoginRoute>
            <Login />
          </LoginRoute>
        ),
      },
      {
        path: "profile",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute>
            <Profile />
          </CheckRoleRoute>
        ),
      },
      {
        path: "book/:id",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute>
            <BookDetailPage />
          </CheckRoleRoute>
        ),
      },
      {
        path: "bucket",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute>
            <CheckoutPage />
          </CheckRoleRoute>
        ),
      },
      {
        path: "borrowedbook",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute>
            <ListofBorrowedbook />
          </CheckRoleRoute>
        ),
      },
      {
        path: "booklist",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute roles={[ROLE.LIBRARIAN]}>
            <ListofBook />
          </CheckRoleRoute>
        ),
      },
      {
        path: "userlist",
        loader: sessionLoader,

        element: (
          <CheckRoleRoute roles={[ROLE.LIBRARIAN]}>
            <ListofStudentPage />
          </CheckRoleRoute>
        ),
      },
      {
        path: "scanentry",
        loader: sessionLoader,

        element: (
          <CheckRoleRoute roles={[ROLE.LIBRARIAN]}>
            <TrackPage tracktype="entry" />
          </CheckRoleRoute>
        ),
      },
      {
        path: "scanr",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute roles={[ROLE.LIBRARIAN]}>
            <TrackPage tracktype="borrowbook" />
          </CheckRoleRoute>
        ),
      },
      {
        path: "summary",
        loader: sessionLoader,
        element: (
          <CheckRoleRoute roles={[ROLE.LIBRARIAN, ROLE.HEADDEPARTMENT]}>
            <SummaryStudentInfopage />
          </CheckRoleRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Allcontext>
      <Suspense fallback={<PageLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </Allcontext>
  </StrictMode>
);
