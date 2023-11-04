import "./App.css";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";

// components
import MoviesPage from "./components/MoviesPage/MoviesPage.jsx";

//layouts
import RootLayout from "./components/layouts/RootLayout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="home" element={<MoviesPage />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
