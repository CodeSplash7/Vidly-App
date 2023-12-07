import { useEffect, useState, createContext, useContext } from "react";

// custom components
import MovieFilter from "./MovieFilter";
import MovieCount from "./MovieCount";
import MovieSearch from "./MovieSearch";
import MovieTable from "./MovieTable";
import MoviePagination from "./MoviePagination";

// helper functions
import { searchMovies } from "../../helperFunctions.js";
import {
  localStorageJSONGet,
  localStorageJSONSet
} from "../../helperFunctions.js";

// services
import http from "../../services/httpService.js";
import { useNavigate, useLoaderData } from "react-router-dom";

// context for the access of the movie handlers in this component
let MovieHandlersContext = createContext();

function MoviesPage() {
  // State
  let [loaderData] = useState();
  // the number of movies per division
  let [divisionLength, setDivisionLength] = useState(4);
  // the index of the current division to display but +1 to make sense
  let [currentDivision, setCurrentDivision] = useState(1);
  // all of the movies fetched from the database
  let [movies, setMovies] = useState(localStorageJSONGet("movies"));

  // the movies that have been filtered/selected to be shown in the table
  let [selectedMovies, setSelectedMovies] = useState([]);
  // array of genre objects
  let [genres, setGenres] = useState(localStorageJSONGet("genres"));
  // groups for the movies
  let [divisions, setDivisions] = useState([]);
  // this is used for filtering genres and no filter is added
  let [valueOfNoFilter] = useState("all");
  // filters the movies by the genre, "all" meaning no filter
  let [filter, setFilter] = useState(valueOfNoFilter);
  // filters the movies by the title, the value of this variable changes the selectedMovies
  let [searchInput, setSearchInput] = useState("");
  // the movies are orderd in the order and by the property of this objects
  let [sorting, setSorting] = useState({ property: "title", order: "asc" });

  const navigate = useNavigate();

  // "template" for the table
  let [tableColumns] = useState([
    { id: 1, type: "value", content: "title" },
    { id: 2, type: "value", content: "genre" },
    { id: 3, type: "value", content: "stock" },
    { id: 4, type: "value", content: "rating" },
    { id: 5, type: "bonus", for: "buttons", contents: ["like", "delete"] }
  ]);

  useEffect(() => {
    loaderData = loadMoviesGenres();
    loaderData.then(([movies, genres]) => {
      setMovies(movies);
      setGenres(genres);
    });
  }, []);

  // transform the genre for all movies
  // generate genre property from the genreId property of movies &&
  // set genres for local storage
  useEffect(() => {
    getGenrePropertyForMovies();
    localStorageJSONSet("genres", genres);
  }, [genres]);

  // select the movies when movies changes or if sorting changes
  useEffect(() => {
    selectMovies();
    // if the user isnt using a real filter(like "all" filter)
    if (filter === valueOfNoFilter) filterMoviesBySearch(searchInput);
  }, [movies, sorting]);

  // store movies in local storage
  useEffect(() => {
    localStorageJSONSet("movies", movies);
  }, [movies]);

  // when filter changes filter the movies showing accordingly and reset the searchInput if the user changed the filter
  useEffect(() => {
    if (filter !== valueOfNoFilter) {
      selectMovies();
      setSearchInput("");
    }
  }, [filter]);

  // separate the movies into divisions
  // each divisions is an array with the max length equal to divisionLength
  useEffect(() => {
    divideMovies();
  }, [selectedMovies]);

  return (
    <>
      <MovieHandlersContext.Provider
        value={{
          handleLikeMovie,
          handleDeleteMovie,
          sorting: { handleSorting: setSorting, currentSorting: sorting }
        }}
      >
        <div className="w-full h-fit flex px-16 justify-start items-start gap-8">
          <div className="w-[152px] h-full flex flex-col gap-[32px]">
            <h2 className="text-[26px] text-white font-semibold">Movies</h2>
            <MovieFilter
              currentFilter={filter}
              genres={genres}
              filterMovies={filterMoviesByGenre}
              valueOfNoFilter={valueOfNoFilter}
            />
            <button
              className="transition transition:background duration-150 hover:bg-[#2B6E9D]
            w-full rounded-[10px] flex justify-center text-white text-[15px] px-[20px] py-[10px] bg-blue "
              onClick={() => navigate("/movies/new")}
            >
              New Movies
            </button>
          </div>
          <div className="w-full h-fit flex flex-col gap-[24px] p-[16px] rounded-[10px] bg-black">
            <MovieCount moviesCount={selectedMovies.length} />
            <MovieSearch
              searchInput={searchInput}
              searchMovies={filterMoviesBySearch}
            />
            <MovieTable
              movies={getCurrentDivisionContent()}
              tableColumns={tableColumns}
            />
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
      </MovieHandlersContext.Provider>
    </>
  );

  // set selectedMovies state variable to the sorted and filtered/searched movies array
  function selectMovies() {
    let newSelectedMovies;
    newSelectedMovies = filterMoviesByGenre(filter);
    newSelectedMovies = sortMovies(newSelectedMovies, sorting);
    setSelectedMovies(newSelectedMovies);
  }

  // sorts the array given by the sorting object given
  function sortMovies(moviesToSort, sortingGiven) {
    let { property, order } = sortingGiven;
    if (moviesToSort.length == 0) return;
    let sortedMovies = moviesToSort.sort((a, b) => {
      a = a.data[property];
      b = b.data[property];
      // if a comes before b, return a positive number
      if (a < b) {
        return order === "asc" ? -1 : 1;
      }
      // if a comes after b, return a negative number
      if (a > b) {
        return order === "asc" ? 1 : -1;
      }
      // if a and b are equal, return 0
      return 0;
    });
    setSorting(sortingGiven);
    return sortedMovies;
  }

  // set selectedMovies(the ones showing) to the movies matching the search, if no search all movies are returned
  function filterMoviesBySearch(search) {
    setFilter("all");
    setSelectedMovies(searchMovies(movies, search));
    setSearchInput(search);
  }
  // changes the selectedMovies to the result and the filter to the genre
  // if passed "all" it doesnt filter anything
  function filterMoviesByGenre(genre) {
    if (genre === valueOfNoFilter) {
      setSelectedMovies(movies);
      setFilter(genre);
      return movies;
    }
    let filtered = movies.filter((movie) => movie.data.genre === genre);
    setFilter(genre);
    return filtered;
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
      localStorageJSONSet("movies", movies);
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
      localStorageJSONSet("movies", newMovies);
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

export async function loadMovie({ params: { id } }) {
  let res;
  try {
    res = localStorageJSONGet("movies").find((movie) => movie.id == id);
    return res;
  } catch {
    return null;
  }
}

export function loadMoviesGenres() {
  let movies;
  let genres;
  let res;
  try {
    // movies = http.get("movies").then((res) => res.data);
    movies = http.get("movies").then((res) => res.data);
    genres = http.get("genres").then((res) => res.data);
    return Promise.all([movies, genres]);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function loadMovies() {
  let movies;
  let res;
  try {
    res = await http.get("movies");
    movies = res.data;
    return movies;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function loadGenres() {
  let genres;
  let res;
  try {
    res = await http.get("genres");
    genres = res.data;
    return genres;
  } catch (err) {
    console.log(err);
    return null;
  }
}
