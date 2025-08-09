import "./App.scss";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ISiteData, fetchSiteData } from "./services/data.service";
import { IPageLayoutProps, PageLayout } from "./layouts/page.layout";
import { AppHeader } from "./components/appheader.component";
import Stack from "react-bootstrap/esm/Stack";

export default function App() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const props: IPageLayoutProps = { data };

  useEffect(() => {
    console.log("Fetching site data...");
    fetchSiteData().then((siteData: ISiteData) => {
      setData((prev) => ({ ...siteData }));
      setIsLoaded(true);
      console.log("Site data fetched successfully");
    });
  }, []);

  // const siteData = { parks, hikes }
  return (
    <div className={`app ${isLoaded ? "loaded" : ""}`}>
      <AppHeader />
      {isLoaded && (
        <PageLayout {...props}>
          <Outlet />
        </PageLayout>
      )}
      {!isLoaded && (
        <Stack className="mt-5">
          <ClimbingBoxLoader 
            size={20}
            color="var(--app-heading-background-color)"
            cssOverride={{ margin: "auto" }}
          />
        </Stack>
      )}
      <footer></footer>
    </div>
  );
}
  