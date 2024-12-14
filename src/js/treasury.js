const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
      const isClickInsideHamburger = hamburger.contains(event.target);
      const isClickInsideMenu = mobileNav.contains(event.target);

      if (!isClickInsideHamburger && !isClickInsideMenu && mobileNav.classList.contains('show')) {
        mobileNav.classList.remove('show');
      }
    });
    
   // Format number as Rupiah without decimals
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

// Fetch Bitcoin price in IDR from CoinGecko
async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr');
        const data = await response.json();
        return data.bitcoin.idr; // Return Bitcoin price in IDR
    } catch (error) {
        console.error('Failed to fetch Bitcoin price:', error);
        return null;
    }
}

// Update Dashboard with Manual Bitcoin Quantity
async function updateDashboard() {
    const bitcoinPrice = await fetchBitcoinPrice(); // Fetch real-time Bitcoin price
    if (!bitcoinPrice) return; // Stop if price fetch fails

    // Manual Bitcoin Amount
    const bitcoinQuantity = 0.001; // Set your Bitcoin amount manually

    // Calculate Bitcoin Value
    const bitcoinValue = bitcoinQuantity * bitcoinPrice;

    // Asset Data
    const assetData = [
        { name: 'Rupiah (Cash)', value: 50000 },
        { name: 'Bitcoin', value: bitcoinValue }
    ];

    // Update Total Balance
    const totalBalanceElem = document.getElementById('totalBalance');
    const totalBalance = assetData.reduce((sum, asset) => sum + asset.value, 0);
    totalBalanceElem.innerText = formatRupiah(totalBalance);

    // Update Asset Table
    const assetTableBody = document.getElementById('assetTable').getElementsByTagName('tbody')[0];
    assetTableBody.innerHTML = ''; // Clear existing rows
    assetData.forEach(asset => {
        const row = assetTableBody.insertRow();
        const cellName = row.insertCell(0);
        const cellQuantity = row.insertCell(1);
        const cellValue = row.insertCell(2);

        cellName.innerText = asset.name;
        cellQuantity.innerText = asset.name === 'Bitcoin' ? bitcoinQuantity : '-';
        cellValue.innerText = formatRupiah(asset.value);
    });

    // Update Donut Chart
    const ctx = document.getElementById('donutChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: assetData.map(asset => asset.name),
            datasets: [{
                data: assetData.map(asset => asset.value),
                backgroundColor: ['#FF8800', '#FFBB55'],
                borderColor: '#222',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#ff8800'
                    }
                }
            }
        }
    });
}

// Execute updateDashboard on page load
document.addEventListener('DOMContentLoaded', updateDashboard);
