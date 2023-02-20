import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/error.page";
import "./index.css";
import { EastBayChallengePage, HikesPage, ParksPage, PlansPage } from "./pages";
import { GitHubCorner } from "./components/github-corner.component";

const rootElement: React.ReactNode = (
  <>
    <App />
    <GitHubCorner />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: rootElement,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "challenge",
        element: <EastBayChallengePage />,
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
