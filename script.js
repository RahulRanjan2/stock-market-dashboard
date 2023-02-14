const addStockButton = document.getElementById('add-stock');
const intradayButton = document.getElementById('intraday');
const weeklyButton = document.getElementById('weekly');
const dailyButton = document.getElementById('daily');
const monthlyButton = document.getElementById('monthly');
const watchlist = document.querySelector('.watchlist');
const stockCards = document.querySelectorAll('.stock-card');
const deleteButtons = document.querySelectorAll('.delete-button');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeButton = document.querySelector('.close');

// Add event listeners
addStockButton.addEventListener('click', addStock);
intradayButton.addEventListener('click', selectTimeframe);
weeklyButton.addEventListener('click', selectTimeframe);
dailyButton.addEventListener('click', selectTimeframe);
monthlyButton.addEventListener('click', selectTimeframe);
for (let i = 0; i < stockCards.length; i++) {
  stockCards[i].addEventListener('click', openModal);
}
for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', deleteStock);
}
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Define functions
function addStock() {
  // Get stock symbol input value
  const stockSymbolInput = document.getElementById('stock-symbol');
  const stockSymbol = stockSymbolInput.value;
  // Create new stock card and add to watchlist
  const newStockCard = document.createElement('div');
  newStockCard.classList.add('stock-card');
  newStockCard.innerHTML = `
    <div class="card-header">
      <h3>${stockSymbol}</h3>
      <button class="delete-button">Delete</button>
    </div>
    <div class="card-body">
      <p>Stock Price</p>
      <p>Other Stock Data</p>
    </div>
  `;
  watchlist.appendChild(newStockCard);
  // Clear stock symbol input
  stockSymbolInput.value = '';
}

function selectTimeframe(event) {
  // Highlight selected timeframe button and remove highlighting from others
  const selectedButton = event.target;
  const buttons = [intradayButton, weeklyButton, dailyButton, monthlyButton];
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i] === selectedButton) {
      buttons[i].classList.add('selected');
    } else {
      buttons[i].classList.remove('selected');
    }
  }
}

function openModal(event) {
    // Get stock name and timeframe
    const stockName = event.currentTarget.querySelector('h3').textContent;
    const selectedButton = document.querySelector('.timeframe-container .selected');
    const timeframe = selectedButton.textContent.toLowerCase();
    // Get stock data from API
    const apiKey = '3V8ON25NY23CAA0Y';
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_${timeframe}&symbol=${stockName}&apikey=${apiKey}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Get latest stock price
        const latestDate = Object.keys(data['Time Series (Daily)'])[0];
        const latestPrice = data['Time Series (Daily)'][latestDate]['4. close'];
        // Display stock data in modal
        modal.style.display = 'block';
        modalContent.innerHTML = `
          <span class="close">&times;</span>
          <h2>${stockName} - ${timeframe}</h2>
          <p>Latest Price: $${latestPrice}</p>
        `;
      })
      .catch(error => console.error(error));
  }
  

function deleteStock(event) {
  // Remove stock card from watchlist
  const stockCard = event.currentTarget.parentNode.parentNode;
  watchlist.removeChild(stockCard);
}

function closeModal() {
  // Hide modal
  modal.style.display = 'none';
}

function outsideClick(event) {
  // Hide modal when user clicks outside of it
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}
