//for landing Page, auth Pages
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="app-container">
      <div className="main-content-wrapper">
        <Navbar />
        <main className="public-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default PublicLayout;