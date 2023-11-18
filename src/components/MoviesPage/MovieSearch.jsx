function MovieSearch({ searchInput, setSearchInput, searchMovies }) {
  return (
    <>
      <input
        onInput={(e) => setSearchInput(e.target.value)}
        value={searchInput}
      ></input>
    </>
  );
}

export default MovieSearch;
