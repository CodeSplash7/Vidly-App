import { useEffect, useState, createContext, useContext } from "react";

// custom components
import MovieFilter from "./MovieFilter";
import MovieCount from "./MovieCount";
import MovieSearch from "./MovieSearch";
import MovieTable from "./MovieTable";
import MoviePagination from "./MoviePagination";

// helper functions
import { searchMovies } from "../../helperFunctions.js";

// services
import http from "../../services/httpService.js";

// context for the access of the movie handlers in this component
let MovieHandlersContext = createContext();

function MoviesPage() {
  // state
  // the number of movies per division
  let [divisionLength, setDivisionLength] = useState(4);
  // the index of the current division to display but +1 to make sense
  let [currentDivision, setCurrentDivision] = useState(1);
  // all of the movies fetched from the database
  let [movies, setMovies] = useState([]);
  // the movies that have been filtered/selected to be shown in the table
  let [selectedMovies, setSelectedMovies] = useState([]);
  // array of genre objects
  let [genres, setGenres] = useState([]);
  // groups for the movies
  let [divisions, setDivisions] = useState([]);
  // this is used for filtering genres and no filter is added
  let [valueOfNoFilter] = useState("all");
  // filters the movies by the genre, "all" meaning no filter
  let [filter, setFilter] = useState(valueOfNoFilter);
  // filters the movies by the title, the value of this variable changes the selectedMovies
  let [searchInput, setSearchInput] = useState("");

  // "template" for the table
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

  // transform the genre for all movies
  // generate genre property from the genreId property of movies
  useEffect(() => {
    getGenrePropertyForMovies();
  }, [genres]);

  // filter the selectedMovies by the state variable of filter
  useEffect(() => {
    filterMoviesByGenre(filter);
    // if the user isnt using a real filter
    if (filter === valueOfNoFilter)
      // set selectedMovies(the ones showing) to the movies matching the search, if no search all movies are returned
      filterMoviesBySearch(searchInput);
  }, [movies]);

  useEffect(() => {
    if (filter !== valueOfNoFilter) {
      filterMoviesByGenre(filter);
      setSearchInput("");
    }
  }, [filter]);

  // separate the movies into divisions
  // each divisions is an array with the max length equal to divisionLength
  useEffect(() => {
    divideMovies();
  }, [selectedMovies]);

  useEffect(() => {
    // if the hook was activated because the useEffect hook for the filter reseted it then stop
    if (searchInput === "" && filter !== valueOfNoFilter) return;
    setFilter("all");
    filterMoviesBySearch(searchInput);
  }, [searchInput]);

  return (
    <>
      <MovieHandlersContext.Provider
        value={{ handleLikeMovie, handleDeleteMovie }}
      >
        <div className="movies-page content-page">
          <div className="movies-page__section--left">
            <h2 className="movies-page__title">Movies</h2>
            <div className="movies-page__filter">
              <MovieFilter
                currentFilter={filter}
                genres={genres}
                filterMovies={filterMoviesByGenre}
                valueOfNoFilter={valueOfNoFilter}
              />
            </div>
            <button className="movies-page__new-movie-button">
              New Movies
            </button>
          </div>
          <div className="movies-page__section--right">
            <p className="movies-page__count">
              <MovieCount moviesCount={selectedMovies.length} />
            </p>
            <div className="movies-page__search">
              <MovieSearch
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                searchMovies={filterMoviesBySearch}
              />
            </div>
            <div className="movie-table">
              <MovieTable
                movies={getCurrentDivisionContent()}
                tableColumns={tableColumns}
              />
            </div>
            <div className="movies-page__pagination">
              <MoviePagination
                pages={
                  divisions.length > 0 && divisions[0].length > 0
                    ? divisions.length
                    : 0
                }
                currentPage={{
                  currentPage: currentDivision,
                  setCurrentPage: setCurrentDivision
                }}
              />
            </div>
          </div>
        </div>
      </MovieHandlersContext.Provider>
    </>
  );

  function filterMoviesBySearch(search) {
    setSelectedMovies(searchMovies(movies, search));
  }
  // changes the selectedMovies to the result and the filter to the genre
  // if passed "all" it doesnt filter anything
  function filterMoviesByGenre(genre) {
    if (genre === valueOfNoFilter) {
      setSelectedMovies(movies);
      setFilter(genre);
      return;
    }
    let filtered = movies.filter((movie) => movie.data.genre === genre);
    setSelectedMovies(filtered);
    setFilter(genre);
  }

  // returns the movies that correspond to the currentDivision from the state
  // if that division is out of movies it return the previous one
  function getCurrentDivisionContent() {
    if (divisions.length < 1) return [];

    let result;

    let i = 0;

    // look backwards from the currentDivision until a *defined division is found
    while (result === undefined) {
      i++;
      result = divisions[currentDivision - i];
    }

    // if the currentDivision is empty reset the state to the one that was found above
    if (i > 1) {
      setCurrentDivision(currentDivision - 1);
    }

    return result;
  }

  // transform genre every for movies
  // add genre property to movies with the correponding genre name from the genres array based the genreId property
  function getGenrePropertyForMovies() {
    // if movies array is empty then stop
    if (!movies.length > 0) return;

    // else transform the genres
    let newMovies = movies.map((movie) => {
      movie.data.genre = genres.find(
        (genre) => genre.id === movie.data.genreId
      ).name;
      return movie;
    });
    setMovies(newMovies);
  }

  function divideMovies() {
    // check if the arguments are valid
    if (
      !Array.isArray(movies) ||
      !Number.isInteger(divisionLength) ||
      divisionLength < 1
    ) {
      return new Error("Invalid arguments");
    }
    // if all movies are deleted than don't do all the code below but return the divisions with one empty division so the code may work properly
    // as the movies are generated from a list a empty one renders no movies
    if (selectedMovies.length < 1) {
      setDivisions([[]]);
      return;
    }

    // create an empty array to store the result
    let divisions = [];
    // loop through the array and slice it into subarrays of divisionLength
    for (let i = 0; i < selectedMovies.length; i += divisionLength) {
      let subarray = selectedMovies.slice(i, i + divisionLength);
      divisions.push(subarray);
    }

    let lastDivision = divisions[divisions.length - 1];
    while (lastDivision.length < divisionLength) {
      lastDivision.push(null);
    }

    // set the state of divisions
    setDivisions(divisions);
  }

  async function handleLikeMovie(movie) {
    let previousMovies = movies;
    // new movies with the one liked having the prperty changed accordingly
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
    // new movies with the movie to be deleted missing
    let newMovies = movies.filter((newMovie) => newMovie.id !== movie.id);
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
