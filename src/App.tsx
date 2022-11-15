import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Hiking Challenge</Nav.Link>
                <Nav.Link href="#journal">Hikes by Date</Nav.Link>
                <Nav.Link href="#parks">Hikes by Park</Nav.Link>
                <Nav.Link href="#completed">Completed Hikes</Nav.Link>
                <Nav.Link href="#planned">Planned Hikes</Nav.Link>
                <Nav.Link href="https://www.facebook.com/davidhikesalot">Facebook Page</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default App;