import { LinkContainer } from "react-router-bootstrap";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export function AppHeader() {
  return (
    <header>
      <div className="card">
        <div className="card-body">
          <Navbar collapseOnSelect bg="light" expand="lg">
            <Container>
              <Navbar.Toggle aria-controls="navbar-nav" />
              <Navbar.Collapse id="navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer to="/challenge">
                    <Nav.Link>East Bay Challenge</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/parks">
                    <Nav.Link>Parks</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/hikes">
                    <Nav.Link>Completed</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/plans">
                    <Nav.Link>Planned</Nav.Link>
                  </LinkContainer>
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
  );
}
