import "./appheader.component.scss";
import { Navbar, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactNode, useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEllipsisVertical,
  faHiking,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { Theme, getInitialTheme, setTheme } from "../services/theme.service";

const HEADER_ACTIONS_SELECTOR = ".appheader-actions";

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
      placement="left"
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
      placement="left"
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Below the mobile breakpoint, the actions live inside a collapsible
  // menu (see appheader.component.scss); above it, CSS forces the menu
  // open regardless of this state, so we only need to close it here.
  useEffect(() => {
    if (!menuOpen) return;

    function closeIfOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(HEADER_ACTIONS_SELECTOR)) {
        setMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

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
            <Nav className="appheader-actions">
              <Nav.Link
                as="button"
                type="button"
                className="appheader-menu-toggle"
                aria-label="More options"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="appheader-menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Nav.Link>
              <div
                className={
                  menuOpen
                    ? "appheader-menu-backdrop show"
                    : "appheader-menu-backdrop"
                }
                aria-hidden="true"
              />
              <div
                id="appheader-menu"
                className={
                  menuOpen ? "appheader-menu show" : "appheader-menu"
                }
                onClick={() => setMenuOpen(false)}
              >
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
              </div>
            </Nav>
          </Navbar>
        </div>
      </div>
    </header>
  );
}
