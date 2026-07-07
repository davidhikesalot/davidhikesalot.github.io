import "./appheader.component.scss";
import { Navbar, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactNode, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faHiking, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Theme, getInitialTheme, setTheme } from "../services/theme.service";

interface INavLinkWithTooltipProps {
  href?: string;
  tooltip: string;
  children: ReactNode;
}

function NavLinkWithTooltip({
  href = "",
  tooltip,
  children,
}: INavLinkWithTooltipProps) {
  const id: string = `tooltip-${Math.floor(Math.random() * 2 ** 6)}`;
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 300, hide: 150 }}
      overlay={
        <Tooltip id={id} className="appheader-tooltip">
          {tooltip}
        </Tooltip>
      }
    >
      <Nav.Link href={href}>{children}</Nav.Link>
    </OverlayTrigger>
  );
}

function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";
  const tooltip =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  function toggleTheme() {
    setTheme(nextTheme);
    setThemeState(nextTheme);
  }

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 300, hide: 150 }}
      overlay={
        <Tooltip id="tooltip-theme-toggle" className="appheader-tooltip">
          {tooltip}
        </Tooltip>
      }
    >
      <Nav.Link
        as="button"
        type="button"
        className="theme-toggle-button"
        aria-label={tooltip}
        onClick={toggleTheme}
      >
        <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
      </Nav.Link>
    </OverlayTrigger>
  );
}

export function AppHeader() {
  return (
    <header id="app-header">
      <div className="card">
        <div className="card-body">
          <Navbar>
            <Nav className="me-auto">
              <Navbar.Brand>
              <LinkContainer to="goals">
                  <FontAwesomeIcon icon={faHiking} />
                </LinkContainer>
              </Navbar.Brand>
              <LinkContainer to="goals">
                <Nav.Link>Goals</Nav.Link>
              </LinkContainer>
              <LinkContainer to="parks">
                <Nav.Link>Parks</Nav.Link>
              </LinkContainer>
              <LinkContainer to="hikes">
                <Nav.Link>Hikes</Nav.Link>
              </LinkContainer>
              <LinkContainer to="plans">
                <Nav.Link>Plans</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              <NavLinkWithTooltip
                tooltip="David Hikes a Lot Facebook Page"
                href="https://www.facebook.com/davidhikesalot"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </NavLinkWithTooltip>
              <NavLinkWithTooltip
                tooltip="View source on GitHub"
                href="https://github.com/davidhikesalot/davidhikesalot.github.io/tree/main"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </NavLinkWithTooltip>
              <ThemeToggle />
            </Nav>
          </Navbar>
        </div>
      </div>
    </header>
  );
}
