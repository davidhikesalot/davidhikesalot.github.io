import "./index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/error.page";
import { GoalsPage, HikesPage, ParksPage, PlansPage } from "./pages";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <GoalsPage />,
      },
      {
        path: "goals",
        element: <GoalsPage />,
      },
      {
        path: "parks",
        element: <ParksPage />,
      },
      {
        path: "hikes",
        element: <HikesPage />,
      },
      {
        path: "plans",
        element: <PlansPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
