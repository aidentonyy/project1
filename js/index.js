/**  
 * Asynchronous function fetching quotes from the quotes JSON file
 */
/**
This script is learnt and used to fetch all exercises from the json file through MDN Web Docs
Reference
*
Author: MDN Web Docs,
Location: https://developer.mozilla.org/en-US/docs/Web/API/Response,
Accessed: 27/5/2025,
*/  
async function getQuotes() {
  try {
    const response = await fetch('json/quotes.json'); // fetch the json file
    if (!response.ok) throw new Error('could not load quotes');
    const quotes = await response.json(); // parse the JSON throught he response
    return quotes; // returns all the quotes
  } catch (err) { // catches an error if quotes cant be fetched
    console.error('error fetching quotes:', err);
    return [];
  }
}

/**  
 * Asynchronous function fetching quotes from the quotes JSON file
 * @param {number} quotes text quotes from json file
 */
function pickQuote(quotes) {
  if (quotes.length === 0) return "Stay motivated and keep pushing!"; // default message for if there are no quotes
  const Today = new Date();
  const dateNumber = Today.getFullYear() * 10000 + (Today.getMonth() + 1) * 100 + Today.getDate(); // create a number for the date
  const quoteIndex = dateNumber % quotes.length; // modulo through quotes based on the date
  return quotes[quoteIndex]; // return a line of a quote depedning on day
}

/**  
 * Displays a chosen quote for the date on the home page
 */
async function displayQuote() {
  const quotes = await getQuotes(); 
  const quote = pickQuote(quotes);
  document.getElementById('quoteDisplay').textContent = quote;
}

// displays the quote as soon as the page DOM is loaded in
window.addEventListener('DOMContentLoaded', displayQuote);
