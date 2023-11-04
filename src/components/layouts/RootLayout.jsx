import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

function RootLayout() {
  return (
    <>
      <div className="page">
        <Navbar />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RootLayout;
