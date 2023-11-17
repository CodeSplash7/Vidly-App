import { capitalize } from "../../helperFunctions";

function MovieFilter({ currentFilter, genres, filterMovies, valueOfNoFilter }) {
  return (
    <>
      <FilterButton currentFilter={currentFilter} genre={valueOfNoFilter} />

      {genres.map((genre, i) => {
        return (
          <FilterButton
            key={i}
            currentFilter={currentFilter}
            genre={genre.name}
            filterMovies={filterMovies}
          />
        );
      })}
    </>
  );
}

function FilterButton({ currentFilter, genre, filterMovies }) {
  return (
    <div
      onClick={() => filterMovies(genre)}
      // adding the main class and the active class if it's the case
      className={`movies-page__filter-btn ${
        currentFilter == genre && "movies-page__filter-btn--active"
      }`}
    >
      <div className="movies-page__filter-content">
        <p className="movies-page__filter-genre">{capitalize(genre)}</p>
        <div className="movies-page__filter-underline"></div>
      </div>
    </div>
  );
}

export default MovieFilter;
