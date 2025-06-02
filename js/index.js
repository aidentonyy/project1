// load quotes from quotes.txt
async function fetchQuotes() {
  try {
    const res = await fetch('quotes.txt');
    if (!res.ok) throw new Error('could not load quotes');
    const text = await res.text();
    // split text by new lines, remove empty lines
    const quotes = text.split('\n').map(line => line.trim()).filter(line => line);
    return quotes;
  } catch (err) {
    console.error('error fetching quotes:', err);
    return [];
  }
}

// pick quote based on today's date
function getQuoteOfTheDay(quotes) {
  if (quotes.length === 0) return "stay motivated and keep pushing!";
  const now = new Date();
  const dayNum = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = dayNum % quotes.length;
  return quotes[index];
}

// show the quote on page
async function displayQuote() {
  const quotes = await fetchQuotes();
  const quote = getQuoteOfTheDay(quotes);
  document.getElementById('quoteDisplay').textContent = quote;
}

// run when page loads
window.addEventListener('DOMContentLoaded', displayQuote);
