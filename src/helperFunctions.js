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

// This function gets a value from localStorage using a key and parses it as JSON
// It returns the parsed value or null if the key does not exist or the value is not valid JSON
// It throws an error if the localStorage is not supported or accessible
export function localStorageJSONGet(key) {
  // Check if localStorage is supported and accessible
  if (window.localStorage) {
    // Get the value from localStorage using the key
    let value = localStorage.getItem(key);
    // Try to parse the value as JSON
    try {
      let parsedValue = JSON.parse(value);
      // Return the parsed value
      return parsedValue;
    } catch (error) {
      // Return null if the value is not valid JSON
      return null;
    }
  } else {
    // Throw an error if localStorage is not supported or accessible
    throw new Error("localStorage is not supported or accessible");
  }
}

// This function sets a value in localStorage using a key and stringifies it as JSON
// It returns true if the value is successfully stored or false if the value is not valid JSON
// It throws an error if the localStorage is not supported, accessible, or has enough space
export function localStorageJSONSet(key, value) {
  // Check if localStorage is supported and accessible
  if (window.localStorage) {
    // Try to stringify the value as JSON
    try {
      let stringValue = JSON.stringify(value);
      // Set the value in localStorage using the key
      localStorage.setItem(key, stringValue);
      // Return true if the value is successfully stored
      return true;
    } catch (error) {
      // Return false if the value is not valid JSON
      return false;
    }
  } else {
    // Throw an error if localStorage is not supported or accessible
    throw new Error("localStorage is not supported or accessible");
  }
}
