function MovieTable({ movies, tableColumns }) {
  return (
    <>
      <table>
        <MovieTableHead columns={tableColumns} />
        <MovieTableBody movies={movies} columns={tableColumns} />
      </table>
    </>
  );
}

function MovieTableHead({ columns }) {
  return (
    <>
      <thead>
        <tr>
          {columns.map((column, i) => {
            if (column.type !== "value") return;
            return <th key={i}>{capitalize(column.content)}</th>;
          })}
        </tr>
      </thead>
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
      <tbody>
        {movies.map((movie, i) => (
          <MovieTableBodyRow key={i} movie={movie} columns={columns} />
        ))}
      </tbody>
    </>
  );
}

function MovieTableBodyRow({ movie, columns }) {
  return (
    <>
      <tr>
        {columns.map((column, i) => {
          // console.log(column, movie.data.genre, movie.data);
          if (column.type === "value")
            return <ValueCell key={i} value={movie.data[column.content]} />;
          if (column.type === "bonus" && column.for === "buttons")
            return <ButtonsCell key={i} contents={column.contents} />;
        })}
      </tr>
    </>
  );
}

function ValueCell({ value }) {
  return <td>{value}</td>;
}

function ButtonsCell({ contents }) {
  return (
    <td>
      <div>
        {contents.map((content, i) => (
          <button key={i}>{content}</button>
        ))}
      </div>
    </td>
  );
}

export default MovieTable;
