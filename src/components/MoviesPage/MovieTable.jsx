import { useState } from "react";
import { useMovieHandlersContext } from "./MoviesPage.jsx";
import { capitalize } from "../../helperFunctions.js";
import { useNavigate } from "react-router-dom";

export default function MovieTable({ movies, tableColumns }) {
  return (
    <>
      <div className="w-full h-fit flex flex-col">
        <MovieTableHead columns={tableColumns} />
        <MovieTableBody movies={movies} columns={tableColumns} />
      </div>
    </>
  );
}

function MovieTableHead({ columns }) {
  return (
    <>
      <div className="w-full h-fit flex flex-row px-[32px] py-[10px] bg-gray rounded-t-[10px]">
        {
          // loop through the head cells/columns
          columns.map((column) => (
            <div
              key={column.id}
              className="w-full h-fit text-[15px] text-[#d6d6d6] flex gap-[16px] font-[600]"
            >
              {
                // if the cell is for a value
                column.type === "value" && (
                  <HeadColumnValue columnContent={column.content} />
                )
                // if the cell is for something else(e.g. bonus) it won't return anything, yet because there is no need for that
              }
            </div>
          ))
        }
      </div>
    </>
  );
}
function MovieTableBody({ movies, columns }) {
  let exampleRow = Object.assign({}, movies[0]);
  if (movies.length > 0) exampleRow.liked = false;

  return (
    <>
      <div className="w-full h-fit">
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
  let navigate = useNavigate();
  return (
    <>
      <div
        className={`w-full h-fit px-[32px] py-[10px] flex ${
          invisible ? "[visibility:hidden]" : ""
        }`}
      >
        {columns.map((column, i) => {
          // if the cell is on the column of value
          if (column.type === "value")
            return column.content.toLowerCase() === "title" ? (
              <div
                onClick={() => {
                  navigate(`${movie.id}`);
                }}
                className="w-full h-fit text-[15px] text-[#d6d6d6] flex gap-[16px] font-[250] h-full text-blue underline hover:text-[#215477] transition-color duration-"
                key={i}
              >
                {movie.data[column.content]}
              </div>
            ) : (
              <div
                className="w-full h-fit text-[15px] text-[#d6d6d6] flex gap-[16px] font-[250] h-full"
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
                className="w-full h-fit text-[15px] text-[#d6d6d6] flex gap-[16px] font-[250] h-full first:text-blue first:underline"
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
        className={`group w-fit h-fit flex flex-col px-[20px] justify-center items-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`group-hover:stroke-red duration-150 transition-[fill,stroke] w-[21px] stroke-[1px] stroke-white fill-[#ffffff00] ${
            movie.liked ? "stroke-red fill-red" : ""
          }`}
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
        className="hover:bg-[#9C2140] duration-150 transition-[background] w-[72px] h-[30px] rounded-[8px] px-[12px] py-[6px] bg-red text-[15px] text-white flex justify-center items-center"
      >
        delete
      </button>
    </>
  );
}

function SortButton({ currentSorting, property }) {
  return (
    <>
      {/* div wrapping sort icon, that's the button */}
      <div
        className={`flex justify-center items-start transition-opacity duration-150 
          ${currentSorting.property === property ? "" : "opacity-0"} 
          `}
      >
        {/* sort icon */}
        <svg
          className={`transition-transform duration-150 
            ${currentSorting.order === "asc" ? "" : "rotate-180"}
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
  // get the context from the MoviesPage.jsx
  let {
    sorting: { handleSorting, currentSorting }
  } = useMovieHandlersContext();

  // order values array
  let orders = ["asc", "desc"];

  return (
    <>
      {/* div containing the sort button and the head cell text */}
      <div onClick={sortMovies} className="flex gap-[5px]">
        <div className="">{capitalize(columnContent)}</div>
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
