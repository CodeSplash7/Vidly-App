export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Define a function that takes an array of objects and a search term as parameters
export function searchMovies(array, term) {
  // Initialize an empty array to store the matching objects
  let matches = [];
  // Loop through the array of objects
  for (let i = 0; i < array.length; i++) {
    // Get the current object and its title
    let object = array[i];
    let title = object.data.title;
    // Check if the title includes the search term, ignoring case
    if (title.toLowerCase().includes(term.toLowerCase())) {
      // If yes, push the object to the matches array
      matches.push(object);
    }
  }
  // Return the matches array
  return matches;
}
