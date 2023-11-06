import { useEffect, useState } from "react";

// custom components
import MovieFilter from "./MovieFilter";
import MovieCount from "./MovieCount";
import MovieSearch from "./MovieSearch";
import MovieTable from "./MovieTable";
import MoviePagination from "./MoviePagination";

// services
import http from "../../services/httpService.js";

function MoviesPage() {
  // state
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);

  // fetch data on mount
  useEffect(() => {
    async function fetchMoviesData() {
      const response = await http.get("movies");
      setMovies(response.data);
    }
    async function fetchGenresData() {
      const response = await http.get("genres");
      setGenres(response.data);
    }

    fetchMoviesData();
    fetchGenresData();
  }, []);

  return (
    <>
      <div className="movies-page">
        <div className="movies-page__section--left">
          <h2 className="movies-page__title">Movies</h2>
          <div className="movies-page__filter">
            <MovieFilter />
          </div>
          <button className="movies-page__new-movie-button">New Movies</button>
        </div>
        <div className="movie-page__section--right">
          <div className="movies-page__count">
            <MovieCount />
          </div>
          <div className="movies-page__search">
            <MovieSearch />
          </div>
          <div className="movies-page__table">
            <MovieTable />
          </div>
          <div className="movies-page__pagination">
            <MoviePagination />
          </div>
        </div>
      </div>
    </>
  );
}

export default MoviesPage;
