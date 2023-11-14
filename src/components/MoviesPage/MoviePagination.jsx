function MoviePagination({
  pages,
  currentPage: { currentPage, setCurrentPage }
}) {
  let buttons = [];
  for (let i = 0; i < pages; i++) {
    buttons.push(
      <button key={i} className="bg-white">
        {i + 1}
      </button>
    );
  }
  return <>{buttons}</>;
}

export default MoviePagination;
