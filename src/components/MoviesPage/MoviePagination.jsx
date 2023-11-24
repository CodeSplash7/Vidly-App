function MoviePagination({
  pages,
  currentPage: { currentPage, setCurrentPage }
}) {
  let buttons = [];
  if (pages == 0) return;
  // loop through all the pages and add them to the buttons
  for (let i = 1; i <= pages; i++) {
    buttons.push(
      <button
        key={i}
        className={`hover:border-blue w-[50px] h-[50px] duration-150 transition-[border,background] flex justify-center items-center border-[#0000] border-[1px] ${
          currentPage == i ? "bg-blue" : "bg-gray"
        }  text-white text-[15px]`}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </button>
    );
  }
  // display the buttons
  return (
    <>
      <div className="w-fit h-fit flex gap-[3px]">{buttons}</div>;
    </>
  );
}

export default MoviePagination;
