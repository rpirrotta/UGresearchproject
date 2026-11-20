window.addEventListener('load', function() {

    // 1. Initialize Leaflet map centered over Hawaii
    const map = L.map('hawaiiMap', {
        scrollWheelZoom: false
    }).setView([20.7500, -157.0000], 7);

    // 2. OpenStreetMap basemap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. 5-Year timeline steps (1980 to 2025)
    const years = [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];

    // 4. Historical statistics database [Native %, Developer %] across 10 time steps
    const historicalData = {
        "honolulu":     [[60, 40], [55, 45], [50, 50], [45, 55], [38, 62], [32, 68], [28, 72], [22, 78], [18, 82], [15, 85]],
        "windward":     [[80, 20], [75, 25], [70, 30], [65, 35], [60, 40], [55, 45], [48, 52], [42, 58], [35, 65], [30, 70]],
        "north_shore":  [[70, 30], [65, 35], [58, 42], [52, 48], [45, 55], [38, 62], [32, 68], [25, 75], [20, 80], [15, 85]],
        "leeward":      [[85, 15], [82, 18], [78, 22], [72, 28], [68, 32], [62, 38], [55, 45], [50, 50], [44, 56], [40, 60]],
        "west_maui":    [[65, 35], [60, 40], [53, 47], [46, 54], [40, 60], [34, 66], [28, 72], [22, 78], [17, 83], [12, 88]],
        "south_maui":   [[55, 45], [50, 50], [44, 56], [38, 62], [32, 68], [26, 74], [21, 79], [16, 84], [12, 88], [10, 90]],
        "kona":         [[75, 25], [70, 30], [64, 36], [58, 42], [50, 50], [42, 58], [36, 64], [30, 70], [24, 76], [20, 80]],
        "kauai_north":  [[70, 30], [64, 36], [58, 42], [50, 50], [44, 56], [38, 62], [30, 70], [25, 75], [20, 80], [15, 85]],
        "hilo":         [[82, 18], [78, 22], [74, 26], [70, 30], [65, 35], [60, 40], [55, 45], [50, 50], [45, 55], [40, 60]],
        "molokai":      [[90, 10], [88, 12], [85, 15], [82, 18], [78, 22], [75, 25], [70, 30], [65, 35], [60, 40], [55, 45]]
    };

    // 5. Embedded Regional Boundaries (No external file loading needed)
    const geojsonFeatureCollection = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": { "id": "honolulu", "name": "Metro Honolulu & South Oʻahu" },
                "geometry": { "type": "Polygon", "coordinates": [[[-157.860, 21.250], [-157.880, 21.320], [-157.820, 21.360], [-157.680, 21.310], [-157.700, 21.270], [-157.810, 21.250]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "windward", "name": "Windward Oʻahu (Kāneʻohe to Lāʻie)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-157.680, 21.310], [-157.750, 21.400], [-157.850, 21.500], [-157.920, 21.650], [-157.800, 21.580], [-157.650, 21.380]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "north_shore", "name": "North Shore Oʻahu (Waialua to Kahuku)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-158.150, 21.580], [-158.050, 21.680], [-157.920, 21.650], [-157.950, 21.500], [-158.100, 21.520]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "leeward", "name": "Waiʻanae & Leeward Oʻahu" },
                "geometry": { "type": "Polygon", "coordinates": [[[-158.120, 21.320], [-158.200, 21.400], [-158.250, 21.580], [-158.150, 21.580], [-158.050, 21.380]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "west_maui", "name": "West Maui District (Lahaina & Kāʻanapali)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-156.650, 20.800], [-156.700, 20.900], [-156.680, 21.020], [-156.550, 21.000], [-156.580, 20.880]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "south_maui", "name": "South Maui District (Kīhei & Wailea)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-156.480, 20.780], [-156.450, 20.700], [-156.420, 20.600], [-156.320, 20.600], [-156.380, 20.750]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "kona", "name": "Kona Coast District (Hawaiʻi Island)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-155.920, 19.400], [-156.000, 19.650], [-156.050, 19.850], [-155.900, 20.000], [-155.750, 19.700], [-155.800, 19.450]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "kauai_north", "name": "Kauaʻi North Shore District (Hanalei)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-159.600, 22.180], [-159.580, 22.230], [-159.400, 22.220], [-159.380, 22.150], [-159.520, 22.120]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "hilo", "name": "East Hawaiʻi (Hilo & Puna District)" },
                "geometry": { "type": "Polygon", "coordinates": [[[-155.150, 19.820], [-155.020, 19.720], [-154.820, 19.450], [-155.100, 19.350], [-155.280, 19.600]]] }
            },
            {
                "type": "Feature",
                "properties": { "id": "molokai", "name": "Molokaʻi & Lānaʻi Island Region" },
                "geometry": { "type": "Polygon", "coordinates": [[[-157.300, 21.220], [-156.700, 21.150], [-156.850, 20.800], [-157.250, 21.100]]] }
            }
        ]
    };

    let currentStep = 0;

    function getStyleForFeature(feature, step) {
        const regionId = feature.properties.id;
        const stats = historicalData[regionId] ? historicalData[regionId][step] : [50, 50];
        const [nativePct, developerPct] = stats;

        let fillColor = "rgb(27, 177, 162)"; // Teal
        if (developerPct > nativePct) {
            fillColor = "#7b1f11"; // Red
        }

        return {
            fillColor: fillColor,
            weight: 2,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: 0.65
        };
    }

    function updateMap(step) {
        currentStep = step;
        const year = years[step];
        const displayEl = document.getElementById('eraDisplay');
        if (displayEl) {
            displayEl.textContent = year;
        }

        if (geoJsonLayer) {
            geoJsonLayer.setStyle(function(feature) {
                return getStyleForFeature(feature, step);
            });
        }
    }

    // 6. Initialize GeoJSON layer directly
    const geoJsonLayer = L.geoJSON(geojsonFeatureCollection, {
        style: function(feature) {
            return getStyleForFeature(feature, 0);
        },
        onEachFeature: function(feature, layer) {
            const regionId = feature.properties.id;

            layer.on({
                mouseover: function(e) {
                    e.target.setStyle({ fillOpacity: 0.85, weight: 3 });
                },
                mouseout: function(e) {
                    const currentStats = historicalData[regionId] ? historicalData[regionId][currentStep] : [50, 50];
                    const [nativePct, developerPct] = currentStats;
                    let fillColor = "rgb(27, 177, 162)";
                    if (developerPct > nativePct) fillColor = "#7b1f11";
                    e.target.setStyle({ fillOpacity: 0.65, weight: 2, fillColor: fillColor });
                }
            });

            layer.bindPopup(function() {
                const activeYear = years[currentStep];
                const stats = historicalData[regionId] ? historicalData[regionId][currentStep] : [50, 50];
                const [nativePct, developerPct] = stats;

                let dominantText = "Native / Kuleana Stewardship";
                let domColor = "rgb(27, 177, 162)";
                if (developerPct > nativePct) {
                    dominantText = "Developer & Resort Concentration";
                    domColor = "#7b1f11";
                }

                return `
                    <div style="font-family: Arial, sans-serif; min-width: 210px; color: #2c3e50;">
                        <h4 style="margin: 0 0 6px 0; color: #1b4965; border-bottom: 2px solid ${domColor}; padding-bottom: 4px;">
                            ${feature.properties.name} (${activeYear})
                        </h4>
                        <div style="margin-bottom: 6px; font-size: 0.82rem;">
                            <strong>Dominant:</strong> <span style="color:${domColor}; font-weight:bold;">${dominantText}</span>
                        </div>
                        <hr style="border:0; border-top:1px solid #eee; margin:4px 0;">
                        <p style="margin: 3px 0; font-size: 0.80rem;">Native / Kuleana Control: <b>${nativePct}%</b></p>
                        <p style="margin: 3px 0; font-size: 0.80rem;">Developer / Resort Control: <b style="color:#7b1f11;">${developerPct}%</b></p>
                    </div>
                `;
            });
        }
    }).addTo(map);

    // 7. Slider Event Listener
    const slider = document.getElementById('eraSlider');
    if (slider) {
        slider.addEventListener('input', function(e) {
            updateMap(parseInt(e.target.value));
        });
    }

    // Force map size refresh
    setTimeout(() => map.invalidateSize(), 300);
});

window.addEventListener('load', function() {
    const canvasEl = document.getElementById('hawaiiEconomyChart');
    if (!canvasEl) return;

    const years = ['1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2025'];

    // Datasets
    const homePrices = [118000, 158000, 352000, 360000, 295000, 590000, 607000, 700000, 830000, 1150000];
    const nativeIncome = [19500, 24200, 32400, 35800, 43100, 49800, 50200, 54600, 68200, 82000];
    const inMigrantIncome = [27000, 34500, 46200, 51000, 61500, 71200, 72500, 78900, 96500, 132000];

    new Chart(canvasEl, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Median Single-Family Home Price',
                    data: homePrices,
                    borderColor: '#7b1f11', // Deep Red (Developer/Housing Cost Pressure)
                    backgroundColor: 'rgba(123, 31, 17, 0.04)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#7b1f11',
                    yAxisID: 'yHome',
                    tension: 0.25,
                    fill: true
                },
                {
                    label: 'Mainland Migrant Median Income',
                    data: inMigrantIncome,
                    borderColor: '#e4b301', // Gold / Amber
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#e4b301',
                    yAxisID: 'yIncome',
                    tension: 0.25
                },
                {
                    label: 'Native Hawaiian Median Income',
                    data: nativeIncome,
                    borderColor: 'rgb(27, 177, 162)', // Teal (Native Stewardship Theme)
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgb(27, 177, 162)',
                    yAxisID: 'yIncome',
                    tension: 0.25
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: 'Arial', size: 11, weight: 'bold' },
                        usePointStyle: true,
                        padding: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Timeline (1980–2025)', font: { weight: 'bold' } }
                },
                yHome: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Housing Price ($)',
                        color: '#7b1f11',
                        font: { weight: 'bold' }
                    },
                    ticks: {
                        callback: value => '$' + (value / 1000) + 'k'
                    }
                },
                yIncome: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: {
                        display: true,
                        text: 'Household Income Comparison ($)',
                        color: 'rgb(27, 177, 162)',
                        font: { weight: 'bold' }
                    },
                    ticks: {
                        callback: value => '$' + (value / 1000) + 'k'
                    }
                }
            }
        }
    });
});