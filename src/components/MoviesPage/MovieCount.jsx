function MovieCount({ moviesCount }) {
  return (
    <>
      {moviesCount > 0 && `Showing ${moviesCount} movies in the database.`}
      {moviesCount <= 0 && "No movies in the database."}
    </>
  );
}

export default MovieCount;
