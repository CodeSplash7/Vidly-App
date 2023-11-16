import { useState } from "react";
import { useMovieHandlersContext } from "./MoviesPage.jsx";

export default function MovieTable({ movies, tableColumns }) {
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
          // if the cell is for a value
          if (column.type === "value")
            return (
              <div
                className="movie-table__cell movie-table__cell--head"
                key={i}
              >
                {capitalize(column.content)}
              </div>
            );

          // if the cell is for empty space for buttons in the body
          if (column.type === "bonus")
            return (
              <div
                className="movie-table__cell movie-table__cell--head"
                key={i}
              ></div>
            );
        })}
      </div>
    </>
  );
  // e.g randomstring -> Randomstring
  function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
function MovieTableBody({ movies, columns }) {
  let exampleRow = Object.assign({}, movies[0]);
  console.log(exampleRow)
  if (movies.length > 0) exampleRow.liked = false;

  return (
    <>
      <div className="movie-table__body">
        {movies.map((movie, i) => {
          return (
            <MovieTableBodyRow
              key={i}
              movie={movie !== null ? movie : exampleRow}
              columns={columns}
              invisible={movie !== null ? false : true}
            />
          );
        })}
      </div>
    </>
  );
}

function MovieTableBodyRow({ movie, columns, invisible }) {
  return (
    <>
      <div
        className={`movie-table__body-row ${
          invisible ? "movie-table__body-row--invisible" : ""
        }`}
      >
        {columns.map((column, i) => {
          // if the cell is on the column of value
          if (column.type === "value")
            return (
              <div
                className="movie-table__cell movie-table__cell--body"
                key={i}
              >
                {movie.data[column.content]}
              </div>
            );

          // if the cell is on the column of bonus used for buttons
          if (column.type === "bonus" && column.for === "buttons")
            return (
              <div
                key={i}
                className="movie-table__cell movie-table__cell--body"
              >
                <ButtonsCell contents={column.contents} movie={movie} />
              </div>
            );
        })}
      </div>
    </>
  );
}

function ButtonsCell({ contents, movie }) {
  return (
    <>
      {contents.map((content, i) => {
        // if the button is for like
        if (content === "like") {
          return <LikeMovie key={i} movie={movie} />;
        }
        // if the button is for delete
        if (content === "delete") {
          return <DeleteMovie key={i} movie={movie} />;
        }
      })}
    </>
  );
}

function LikeMovie({ movie }) {
  let { handleLikeMovie } = useMovieHandlersContext();
  return (
    <>
      <div
        onClick={() => {
          movie.liked = !movie.liked;
          handleLikeMovie(movie);
        }}
        className={`movie-table__like ${
          movie.liked ? "movie-table__like--active" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
    </>
  );
}

function DeleteMovie({ movie }) {
  let { handleDeleteMovie } = useMovieHandlersContext();
  return (
    <>
      <button
        onClick={() => handleDeleteMovie(movie)}
        className="movie-table__delete"
      >
        delete
      </button>
    </>
  );
}
