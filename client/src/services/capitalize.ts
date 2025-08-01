export const capitalize=(str:string)=> {
  // Check for valid string input. If not, return an empty string.
  if (typeof str !== 'string' || str.length === 0) {
    console.error("Error: Input must be a non-empty string.");
    return '';
  }

  // Convert the entire string to lowercase to handle mixed-case inputs consistently.
  const lowerCaseStr = str.toLowerCase();

  // Split the string into an array of words based on spaces.
  const words = lowerCaseStr.split(' ');

  // Use map() to create a new array where each word is capitalized.
  const capitalizedWords = words.map(word => {
    // If a word is empty (e.g., multiple spaces), return it as is.
    if (word.length === 0) {
      return '';
    }
    // Capitalize the first letter and concatenate it with the rest of the word.
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the array of capitalized words back into a single string with spaces.
  return capitalizedWords.join(' ');
}
