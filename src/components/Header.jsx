import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Header({ farmID }) {
  const navigate = useNavigate();

  const user = JSON.parse(window.sessionStorage.getItem("user"));
  const farms = JSON.parse(window.sessionStorage.getItem("farms"));
  const logout = () => {
    window.sessionStorage.removeItem("farms");
    window.sessionStorage.removeItem("user");
    navigate("/login");
  }

  const match = useMatch('/farm/:farmID/tools/:tool');

  return (
    <Navbar style={{backgroundColor:"#fff2cc"}} fixed="top" className="fixed-height-navbar custom-navbar">
      <Container>
        <Navbar.Brand className="mx-auto" style={{ flexGrow: 1 }}>
          {!match ?
            <div onClick={(e) => { e.stopPropagation(); navigate(`/farms`) }} style={{ cursor: 'pointer' }}>
              <img
                src="/logo_backgroundless.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="PastureCoach logo"
              />
              <span className="d-none d-lg-inline"> Pasture Coach</span>
            </div>

            :
            <button onClick={(e) => { e.stopPropagation(); navigate(`/farm/${farmID}`) }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FontAwesomeIcon style={{ color: 'black' }} icon={faArrowLeft} />
            </button>
          }
        </Navbar.Brand>

        <Nav>
          <NavDropdown
            title={<span style={{fontWeight:'bold'}}><FontAwesomeIcon icon={faUserCircle} /> {user.email}</span>}
          >
            <NavDropdown.Item onClick={() => navigate("/farms")}>My Farms</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>Disconnect</NavDropdown.Item>
          </NavDropdown>
        </Nav>

      </Container>
    </Navbar>
  );
}

export default Header;