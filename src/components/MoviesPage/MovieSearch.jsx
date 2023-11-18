function MovieSearch({ searchInput, setSearchInput, searchMovies }) {
  return (
    <>
      <input
        placeholder="Search movie..."
        className="movies-page__search-field"
        onInput={(e) => setSearchInput(e.target.value)}
        value={searchInput}
      ></input>
    </>
  );
}

export default MovieSearch;
