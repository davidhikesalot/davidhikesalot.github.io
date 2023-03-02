import "./index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/error.page";
import { EastBayChallengePage, HikesPage, ParksPage, PlansPage } from "./pages";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HikesPage />,
      },
      {
        index: true,
        path: "hikes",
        element: <HikesPage />,
      },
      {
        path: "challenge",
        element: <EastBayChallengePage />,
      },
      {
        path: "parks",
        element: <ParksPage />,
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
