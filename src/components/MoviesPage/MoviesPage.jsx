import MovieFilter from "./MovieFilter"
import MovieCount from "./MovieCount"
import MovieSearch from "./MovieSearch"
import MovieTable from "./MovieTable"
import MoviePagination from "./MoviePagination"

function MoviesPage() {
  console.log("init");
  return (
    <>
      <h2>Movies</h2>
      <MovieFilter />
      <button>New Movie</button>
      <MovieCount />
      <MovieSearch />
      <MovieTable />
      <MoviePagination />
    </>
  );
}

export default MoviesPage;


