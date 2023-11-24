function MovieCount({ moviesCount }) {
  return (
    <p className="text-white text-[15px] font-medium">
      {moviesCount > 0 && `Showing ${moviesCount} movies in the database.`}
      {moviesCount <= 0 && "No movies in the database."}
    </p>
  );
}

export default MovieCount;
