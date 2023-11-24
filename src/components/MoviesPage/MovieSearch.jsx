function MovieSearch({ searchInput, searchMovies }) {
  return (
    <>
      <div className="w-full h-fit">
        <input
          placeholder="Search movie..."
          className="placeholder:text-[#bfbfbf] focus:outline focus:outline-blue focus:outline-[1px] w-[50%] h-[60px] duration-150 outline-[#0000] px-[16px] py-[10px] rounded-[10px] text-[white] text-[15px] bg-gray"
          onInput={(e) => searchMovies(e.target.value)}
          value={searchInput}
        ></input>
      </div>
    </>
  );
}

export default MovieSearch;
