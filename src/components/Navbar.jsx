import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  let [links] = useState([
    { content: "Movies", to: "/movies" },
    { content: "Costumers", to: "/costumers" }
  ]);
  return (
    <>
      <h1 className="text-white text-3xl font-semibold font-['Inter']">
        Vidly
      </h1>
      <div className="justify-center items-center gap-8 flex">
        {links.map((link, index) => (
          <NavLink
            key={index}
            className={({ isActive }) =>
              "hover:text-blue " +
              (isActive
                ? "text-sm font-medium font-['Inter'] text-blue"
                : "text-white text-sm font-['Inter'] transition-colors duration-200")
            }
            to={link.to}
          >
            {link.content}
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default Navbar;
