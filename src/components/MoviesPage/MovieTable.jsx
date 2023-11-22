import { useState } from "react";
import { useMovieHandlersContext } from "./MoviesPage.jsx";
import { capitalize } from "../../helperFunctions.js";

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
        {columns.map((column) => (
          <div
            key={column.id}
            className="movie-table__cell movie-table__cell--head"
          >
            {
              // if the cell is for a value
              column.type === "value" && (
                <HeadColumnValue columnContent={column.content} />
              )
            }
          </div>
        ))}
      </div>
    </>
  );
}
function MovieTableBody({ movies, columns }) {
  let exampleRow = Object.assign({}, movies[0]);
  if (movies.length > 0) exampleRow.liked = false;

  return (
    <>
      <div className="movie-table__body">
        {movies.map((movie, i) => {
          return (
            <MovieTableBodyRow
              key={i}
              // if the movie of this row is null it means it is there to occupy the space for one
              // so return a row similar to the other ones to occupy the same space
              movie={movie !== null ? movie : exampleRow}
              // make the movie be invisible if it is null for the reason explained above
              invisible={movie !== null ? false : true}
              columns={columns}
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

function SortButton({ currentSorting, property }) {
  return (
    <>
      <div
        className={`movie-table__sort-btn 
          ${
            currentSorting.property === property
              ? ""
              : "movie-table__sort-btn--invisible"
          } 
          `}
      >
        <svg
          className={`movie-table__sort-icon 
            ${
              currentSorting.order === "asc"
                ? "movie-table__sort-icon--asc"
                : "movie-table__sort-icon--desc"
            }
          `}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </div>
    </>
  );
}

function HeadColumnValue({ columnContent }) {
  let {
    sorting: { handleSorting, currentSorting }
  } = useMovieHandlersContext();
  // order values array
  let orders = ["asc", "desc"];
  return (
    <>
      <div onClick={sortMovies} className="movie-table__column-head">
        <div className="movie-table__column-head-value">
          {capitalize(columnContent)}
        </div>
        <SortButton currentSorting={currentSorting} property={columnContent} />
      </div>
    </>
  );

  // change the sorting values right from the state
  function sortMovies() {
    let order = "asc";
    if (currentSorting.property !== columnContent) {
      handleSorting({ property: columnContent, order });
      return;
    }
    if (orders.indexOf(currentSorting.order)) order = "asc";
    else order = "desc";
    handleSorting({ property: columnContent, order });
  }
}
