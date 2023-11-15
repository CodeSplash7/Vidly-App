function MoviePagination({
  pages,
  currentPage: { currentPage, setCurrentPage }
}) {
  let buttons = [];
  for (let i = 1; i <= pages; i++) {
    buttons.push(
      <button
        key={i}
        className={`movies-page__pagination-btn ${
          currentPage == i ? "movies-page__pagination-btn--active" : ""
        }`}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </button>
    );
  }
  return <>{buttons}</>;
}

export default MoviePagination;
