import { capitalize } from "../../helperFunctions";

function MovieFilter({ genres, filterMovies }) {
  return (
    <>
      {genres.map((genre, i) => {
        return (
          <button
            key={i}
            onClick={() => filterMovies(genre.name)}
            className="movies-page__filter-btn"
          >
            {capitalize(genre.name)}
          </button>
        );
      })}
    </>
  );
}

export default MovieFilter;
