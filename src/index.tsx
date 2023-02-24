import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/error.page";
import "./index.css";
import { EastBayChallengePage, HikesPage, ParksPage, PlansPage } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "challenge",
        element: <EastBayChallengePage />,
      },
      {
        index: true,
        path: "hikes",
        element: <HikesPage />,
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
