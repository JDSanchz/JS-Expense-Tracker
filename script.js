// Initialize empty transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize global chart variable
let myChart;

// Get the canvas element
const canvas = document.getElementById('myPieChart');

// Step 1: Add a new transaction
function addTransaction() {
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;

  const newTransaction = {
    name,
    price,
    category
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  updateUI();
}

// Step 2: Delete all transactions
function deleteAll() {
  localStorage.removeItem('transactions');
  transactions = [];
  updateUI();
}

// Step 3: Update the list of top 5 most expensive items
function updateTopItems() {
  const sortedTransactions = [...transactions].sort((a, b) => b.price - a.price);
  const topItems = sortedTransactions.slice(0, 5);
  
  const list = document.getElementById('expensive-items-list');
  list.innerHTML = '';
  
  topItems.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name}: $${item.price} (${item.category})`;
    list.appendChild(listItem);
  });
}

// Step 4: Update the UI
function updateUI() {
  updateTopItems();
  drawPieChart();
}

// Step 5: Draw Pie Chart
function drawPieChart() {
  if (myChart) {
    myChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  
  const categorySums = {};
  
  transactions.forEach((transaction) => {
    if (!categorySums[transaction.category]) {
      categorySums[transaction.category] = 0;
    }
    categorySums[transaction.category] += transaction.price;
  });
  
  const labels = Object.keys(categorySums);
  const data = Object.values(categorySums);

  // Set the canvas width and height
  canvas.width = 400; // Set to your preferred width
  canvas.height = 400; // Set to your preferred height
  
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.parsed;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${context.label}: ${percentage}%`;
            }
          }
        }
      }
    }
  });
}

// Initialize the UI
updateUI();
