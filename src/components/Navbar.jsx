import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  let [links] = useState([
    { content: "Movies", to: "/movies" },
    { content: "Costumers", to: "/costumers" }
  ]);
  return (
    <>
      <h1 className="navbar__logo">Vidly</h1>
      <div className="navbar__links">
        {links.map((link, index) => (
          <NavLink
            key={index}
            className={({ isActive }) =>
              isActive ? "navbar__link--active" : "navbar__link"
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
