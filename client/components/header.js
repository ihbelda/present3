import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/users/signup' }, 
    !currentUser && { label: 'Sign In', href: '/users/signin' },
    currentUser && {label: 'Create Event', href: '/events/new' },
    currentUser && {label: 'My Events', href: '/events' },
    currentUser && { label: 'Sign Out', href: '/users/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <Nav key={href} className="me-justify-content-end">
          <Nav.Link className="fw-bold" href={href}>{label}</Nav.Link>
        </Nav>
      );
    });

  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand className="fw-bold" href="/">Present3</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {links}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};