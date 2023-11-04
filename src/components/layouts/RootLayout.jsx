import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

function RootLayout() {
  return (
    <>
      <div className="whole-page">
        <div className="navbar">
          <Navbar />
        </div>
        <div>
          <div className="content-page">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default RootLayout;
