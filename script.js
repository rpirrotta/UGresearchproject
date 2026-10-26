const ctx = document.getElementById('displacementChart').getContext('2d');

const censusYears = [];
const hawaiiData = [];
const mainlandData = [];

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

new Chart(ctx, {
    type: 'line',
    data: {
        labels: censusYears,
        datasets: [
            {
                label: 'Native Hawaiians in Hawaii',
                data: hawaiiData,
                borderColor: '#3B9C9C',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
                tension: 0.2
            },
            {
                label: 'Native Hawaiians on U.S. Mainland',
                data: mainlandData,
                borderColor: '#FFAE42',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                fill: true,
                tension: 0.2
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Total Population' }
            }
        }
    }
});