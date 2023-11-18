function MovieSearch({ searchInput, searchMovies }) {
  return (
    <>
      <input
        placeholder="Search movie..."
        className="movies-page__search-field"
        onInput={(e) => searchMovies(e.target.value)}
        value={searchInput}
      ></input>
    </>
  );
}

export default MovieSearch;
