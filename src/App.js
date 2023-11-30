import React from "react";

import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";

// page components
import MoviesPage from "./components/MoviesPage/MoviesPage.jsx";
import MovieFormPage from "./components/MovieFormPage/MovieFormPage.jsx";

//layouts
import RootLayout from "./components/layouts/RootLayout.jsx";

// creating the router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="movies" element={<MoviesPage />} />
      <Route path="movies/new" element={<MovieFormPage />} />
    </Route>
  )
);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
