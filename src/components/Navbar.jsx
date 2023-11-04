import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <h1 className="navbar__logo">Vidly</h1>
      <div className="navbar__links">
        <NavLink
          className={({ isActive }) =>
            isActive ? "navbar__link--active" : "navbar__link"
          }
          to="/movies"
        >
          Movies
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "navbar__link--active" : "navbar__link"
          }
          to="/costumers"
        >
          Costumers
        </NavLink>
      </div>
    </>
  );
}

export default Navbar;
