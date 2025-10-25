import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <Container fluid>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

