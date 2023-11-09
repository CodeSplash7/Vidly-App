function MovieTable({ movies, tableColumns }) {
  return (
    <>
      <MovieTableHead columns={tableColumns} />
      <MovieTableBody movies={movies} columns={tableColumns} />
    </>
  );
}

function MovieTableHead({ columns }) {
  return (
    <>
      <div className="movie-table__head">
        {columns.map((column, i) => {
          if (column.type === "value")
            return (
              <div className="movie-table__cell movie-table__cell--head" key={i}>
                {capitalize(column.content)}
              </div>
            );

          if (column.type === "bonus")
            return <div className="movie-table__cell movie-table__cell--head" key={i}></div>;
        })}
      </div>
    </>
  );

  function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
function MovieTableBody({ movies, columns }) {
  return (
    <>
      <div className="movie-table__body">
        {movies.map((movie, i) => (
          <MovieTableBodyRow key={i} movie={movie} columns={columns} />
        ))}
      </div>
    </>
  );
}

function MovieTableBodyRow({ movie, columns }) {
  return (
    <>
      <div className="movie-table__body-row">
        {columns.map((column, i) => {
          // console.log(column, movie.data.genre, movie.data);
          if (column.type === "value")
            return (
              <div
                className="movie-table__cell movie-table__cell--body"
                key={i}
              >
                {movie.data[column.content]}
              </div>
            );

          if (column.type === "bonus" && column.for === "buttons")
            return (
              <div
                key={i}
                className="movie-table__cell movie-table__cell--body"
              >
                <ButtonsCell contents={column.contents} />;
              </div>
            );
        })}
      </div>
    </>
  );
}

function ButtonsCell({ contents }) {
  return (
    <>
      {contents.map((content, i) => (
        <button key={i}>{content}</button>
      ))}
    </>
  );
}

export default MovieTable;
