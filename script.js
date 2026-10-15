// 1. Generate years and data from 2000 to 2026 dynamically
const censusYears = [];
const hawaiiData = [];
const mainlandData = [];

// Official Census benchmarks & recent trend estimates
const anchors = {
    2000: { hi: 239655, mainland: 161506 },
    2010: { hi: 289970, mainland: 237097 },
    2020: { hi: 309807, mainland: 370635 },
    2026: { hi: 320000, mainland: 430000 }
};

for (let year = 2000; year <= 2026; year++) {
    censusYears.push(year.toString());

    let hiVal, mainlandVal;
    if (year <= 2010) {
        let t = (year - 2000) / 10;
        hiVal = Math.round(anchors[2000].hi + t * (anchors[2010].hi - anchors[2000].hi));
        mainlandVal = Math.round(anchors[2000].mainland + t * (anchors[2010].mainland - anchors[2000].mainland));
    } else if (year <= 2020) {
        let t = (year - 2010) / 10;
        hiVal = Math.round(anchors[2010].hi + t * (anchors[2020].hi - anchors[2010].hi));
        mainlandVal = Math.round(anchors[2010].mainland + t * (anchors[2020].mainland - anchors[2010].mainland));
    } else {
        let t = (year - 2020) / 6;
        hiVal = Math.round(anchors[2020].hi + t * (anchors[2026].hi - anchors[2020].hi));
        mainlandVal = Math.round(anchors[2020].mainland + t * (anchors[2026].mainland - anchors[2020].mainland));
    }

    hawaiiData.push(hiVal);
    mainlandData.push(mainlandVal);
}

// 2. Find the canvas element
const ctx = document.getElementById('displacementChart').getContext('2d');

// Default to the final year (2026, which is index 26) on load
const defaultIndex = 26;

// 3. Create a bar chart for single-year comparisons
const displacementChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [censusYears[defaultIndex]],
        datasets: [
            {
                label: 'Native Hawaiians in Hawaii',
                data: [hawaiiData[defaultIndex]],
                backgroundColor: '#3B9C9C'
            },
            {
                label: 'Native Hawaiians on U.S. Mainland',
                data: [mainlandData[defaultIndex]],
                backgroundColor: '#FFA62F'
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Total Population'
                }
            }
        }
    }
});

// 4. SLIDER INTERACTIVITY (Updates to show ONLY the selected year)
const yearSlider = document.getElementById('yearSlider');
const yearDisplay = document.getElementById('yearDisplay');

yearSlider.addEventListener('input', function(e) {
    const index = parseInt(e.target.value);

    // Set the chart labels and data to just the single selected index
    displacementChart.data.labels = [censusYears[index]];
    displacementChart.data.datasets[0].data = [hawaiiData[index]];
    displacementChart.data.datasets[1].data = [mainlandData[index]];

    displacementChart.update();
    yearDisplay.textContent = censusYears[index];
});