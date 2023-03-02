import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ISiteData, fetchSiteData } from "./services/data.service";
import { IPageLayoutProps, PageLayout } from "./layouts/page.layout";
import { AppHeader } from "./components/appheader.component";
import { GitHubCorner } from "./components/github-corner.component";
import "./App.css";

export default function App() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState({});
  const props: IPageLayoutProps = { data };

  useEffect(() => {
    fetchSiteData().then((siteData: ISiteData) => {
      setData((prev) => ({ ...siteData }));
      setIsLoaded((prev) => true);
    });
  }, []);

  // const siteData = { parks, hikes }
  return (
    <>
      <div className={`app ${isLoaded ? "loaded" : ""}`}>
        <AppHeader />
        <PageLayout {...props}>
          <Outlet />
        </PageLayout>
        <footer></footer>
      </div>
      <GitHubCorner />
    </>
  );
}
