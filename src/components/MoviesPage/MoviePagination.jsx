function MoviePagination({
  pages,
  currentPage: { currentPage, setCurrentPage }
}) {
  let buttons = [];
  if (pages == 0) return;
  // loop through all the pages and add them to the buttons
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
  // display the buttons
  return <>{buttons}</>;
}

export default MoviePagination;
