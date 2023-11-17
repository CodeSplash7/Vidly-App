import { capitalize } from "../../helperFunctions";

function MovieFilter({ currentFilter, genres, filterMovies, valueOfNoFilter }) {
  return (
    <>
      <div
        className={`movies-page__filter-btn ${
          currentFilter == valueOfNoFilter && "movies-page__filter-btn--active"
        }`}
        onClick={() => filterMovies(valueOfNoFilter)}
      >
        <div className="movies-page__filter-content">
          <p className="movies-page__filter-genre">
            {capitalize(valueOfNoFilter)}
          </p>
          <div className="movies-page__filter-underline"></div>
        </div>
      </div>
      {genres.map((genre, i) => {
        return (
          <div
            key={i}
            onClick={() => filterMovies(genre.name)}
            className={`movies-page__filter-btn ${
              currentFilter == genre.name && "movies-page__filter-btn--active"
            }`}
          >
            <div className="movies-page__filter-content">
              <p className="movies-page__filter-genre">
                {capitalize(genre.name)}
              </p>
              <div className="movies-page__filter-underline"></div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default MovieFilter;
