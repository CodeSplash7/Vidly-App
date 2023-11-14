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
  let [divisionLength, setDivisionLength] = useState(4);
  let [currentDivision, setCurrentDivision] = useState(3);
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);
  let [divisions, setDivisions] = useState([]);

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

  useEffect(() => {
    getGenrePropertyForMovies();
    divideMovies();
  }, [genres]);
  console.log(divisions[currentDivision - 1]);
  return (
    <>
      <MovieHandlersContext.Provider
        value={{ handleLikeMovie, handleDeleteMovie }}
      >
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
              <MovieTable movies={getCurrentDivisionContent()} tableColumns={tableColumns} />
            </div>
            <div className="movies-page__pagination">
              <MoviePagination />
            </div>
          </div>
        </div>
      </MovieHandlersContext.Provider>
    </>
  );

  function getCurrentDivisionContent() {
    if (divisions.length > 0) return divisions[currentDivision - 1];
    return [];
  }

  // transform genre every for movies
  function getGenrePropertyForMovies() {
    // if movies array in empty then stop
    if (!movies.length > 0) return;

    // else transform the genres
    movies = movies.map((movie) => {
      movie.data.genre = genres.find(
        (genre) => genre.id === movie.data.genreId
      ).name;
      return movie;
    });
    setMovies(movies);
  }

  function divideMovies() {
    // check if the arguments are valid
    if (
      !Array.isArray(movies) ||
      !Number.isInteger(divisionLength) ||
      divisionLength < 1
    ) {
      return "Invalid arguments";
    }
    // create an empty array to store the result
    let divisions = [];
    // loop through the array and slice it into subarrays of divisionLength
    for (let i = 0; i < movies.length; i += divisionLength) {
      let subarray = movies.slice(i, i + divisionLength);
      divisions.push(subarray);
    }
    // set the state of divisions
    setDivisions(divisions);
  }

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
      // if an error occurs then reset the values
      setMovies(previousMovies);
      console.log(err);
    }
  }

  async function handleDeleteMovie(movie) {
    let previousMovies = movies;
    let newMovies = movies.filter((newMovie) => newMovie.id !== movie.id);
    console.log(newMovies);
    setMovies(newMovies);

    try {
      http.delete(`movies/${movie.id}`);
    } catch (err) {
      // if an error occurs then reset the values
      setMovies(previousMovies);
      console.log(err);
    }
  }
}

export default MoviesPage;

export function useMovieHandlersContext() {
  return useContext(MovieHandlersContext);
}
