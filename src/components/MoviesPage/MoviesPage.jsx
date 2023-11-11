import { useEffect, useState, createContext, useContext } from "react";

// custom components
import MovieFilter from "./MovieFilter";
import MovieCount from "./MovieCount";
import MovieSearch from "./MovieSearch";
import MovieTable from "./MovieTable";
import MoviePagination from "./MoviePagination";

// services
import http from "../../services/httpService.js";

// context
let MovieHandlersContext = createContext();

function MoviesPage() {
  // state
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);

  // the column values are generated based on this
  let [tableColumns] = useState([
    { type: "value", content: "title" },
    { type: "value", content: "genre" },
    { type: "value", content: "stock" },
    { type: "value", content: "rating" },
    { type: "bonus", for: "buttons", contents: ["like", "delete"] }
  ]);

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

  // transform genre every time movies change
  useEffect(() => {
    if (!movies.length > 0) return;
    movies = movies.map((movie) => {
      movie.data.genre = genres.find(
        (genre) => genre.id === movie.data.genreId
      ).name;
      return movie;
    });
    setMovies(movies);
  }, [genres]);

  return (
    <>
      <MovieHandlersContext.Provider value={{ handleLikeMovie }}>
        <div className="movies-page content-page">
          <div className="movies-page__section--left">
            <h2 className="movies-page__title">Movies</h2>
            <div className="movies-page__filter">
              <MovieFilter />
            </div>
            <button className="movies-page__new-movie-button">
              New Movies
            </button>
          </div>
          <div className="movies-page__section--right">
            <div className="movies-page__count">
              <MovieCount />
            </div>
            <div className="movies-page__search">
              <MovieSearch />
            </div>
            <div className="movie-table">
              <MovieTable movies={movies} tableColumns={tableColumns} />
            </div>
            <div className="movies-page__pagination">
              <MoviePagination />
            </div>
          </div>
        </div>
      </MovieHandlersContext.Provider>
    </>
  );

  async function handleLikeMovie(movie) {
    let previousMovies = movies;
    let newMovies = movies.map((newMovie) => {
      if (newMovie.id === movie.id) {
        return movie;
      }
      return newMovie;
    });
    setMovies(newMovies);

    try {
      http.patch(`movies/${movie.id}`, movie);
    } catch (err) {
      setMovies(previousMovies);
      console.log(err);
    }
  }
}

export default MoviesPage;

export function useMovieHandlersContext() {
  return useContext(MovieHandlersContext);
}
