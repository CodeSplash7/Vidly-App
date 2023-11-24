import { capitalize } from "../../helperFunctions";

function MovieFilter({ currentFilter, genres, filterMovies, valueOfNoFilter }) {
  return (
    <>
      <div className="w-full h-fit">
        <FilterButton
          currentFilter={currentFilter}
          genre={valueOfNoFilter}
          filterMovies={filterMovies}
        />

        {genres.map((genre, i) => {
          return (
            <FilterButton
              key={i}
              currentFilter={currentFilter}
              genre={genre.name}
              filterMovies={filterMovies}
            />
          );
        })}
      </div>
    </>
  );
}

function FilterButton({ currentFilter, genre, filterMovies }) {
  return (
    <>
      <div
        onClick={() => filterMovies(genre)}
        // adding the main class and the active class if it's the case
        className={`w-full h-fit flex justify-center p-[16px] border-[1px] border-green bg-black`}
      >
        <div className="w-fit h-fit group">
          <p className="text-[15px] text-white">{capitalize(genre)}</p>
          <div
            className={
              "group-hover:w-full duration-150 w-[0px] h-[1px] bg-blue " +
              (currentFilter == genre && "w-full")
            }
          ></div>
        </div>
      </div>
    </>
  );
}

export default MovieFilter;
