import "./App.css";
import { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { ISiteData, fetchSiteData } from "./services/data.service";
import { IPageLayoutProps, PageLayout } from "./layouts/page.layout";

import {
  EastBayChallengePage,
  HikesPage,
  ParksPage,
  PlansPage,
  YouAreLostPage,
} from "./pages";

export default function App() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState({});
  const props: IPageLayoutProps = { data };

  useEffect(() => {
    console.log("here");
    fetchSiteData().then((siteData: ISiteData) => {
      setData((prev) => ({ ...siteData }));
      setIsLoaded((prev) => true);
    });
  }, []);

  // const siteData = { parks, hikes }
  return (
    <div className="App">
      <header>
        <div className="card">
          <div className="card-header"></div>
          <div className="card-body">
            <Navbar bg="light" expand="sm">
              <Container>
                <Navbar.Collapse>
                  <Nav className="me-auto">
                    <NavLink className="nav-link" to="/challenge">
                      East Bay Challenge
                    </NavLink>
                    <NavLink className="nav-link" to="/hikes">
                      Hikes
                    </NavLink>
                    <NavLink className="nav-link" to="/parks">
                      Parks
                    </NavLink>
                    <NavLink className="nav-link" to="/plans">
                      Planned
                    </NavLink>
                    <Nav.Link href="https://www.facebook.com/davidhikesalot">
                      Facebook Page
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </div>
        </div>
      </header>
      <section id="content" className={`card ${isLoaded ? "loaded" : ""}`}>
        <div className="card-body">
          <Routes>
            <Route element={<PageLayout {...props} />}>
              <Route path="eastbay  " element={<EastBayChallengePage />} />
              <Route path="hikes" element={<HikesPage />} />
              <Route path="parks" element={<ParksPage />} />
              <Route path="plans" element={<PlansPage />} />
            </Route>
            <Route path="*" element={<YouAreLostPage />} />
          </Routes>
        </div>
      </section>
      <footer></footer>
    </div>
  );
}
