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
    
    // Format number as Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

// Update Total Balance and Initialize Donut Chart
function updateDashboard() {
    const assetTable = document.getElementById('assetTable').getElementsByTagName('tbody')[0];
    const totalBalanceElem = document.getElementById('totalBalance');
    const rows = assetTable.getElementsByTagName('tr');

    let totalBalance = 0;
    const assetData = [];
    const assetLabels = [];

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        const assetName = cells[0].innerText;
        const assetValue = parseFloat(cells[2].innerText);

        totalBalance += assetValue;
        assetData.push(assetValue);
        assetLabels.push(assetName);

        // Update table cell with formatted value
        cells[2].innerText = formatRupiah(assetValue);
    }

    // Update total balance with formatted value
    totalBalanceElem.innerText = formatRupiah(totalBalance);

    const ctx = document.getElementById('donutChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: assetLabels,
            datasets: [{
                data: assetData,
                backgroundColor: ['#FF8800', '#FFBB55', '#444'],
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
