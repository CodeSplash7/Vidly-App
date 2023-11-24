import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

function RootLayout() {
  return (
    <>
      <div className="w-screen min-h-screen flex flex-col justify-start items-start gap-12 bg-green">
        <div className="w-full h-24 px-16 py-4 justify-start items-center gap-16 inline-flex bg-black">
          <Navbar />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default RootLayout;
