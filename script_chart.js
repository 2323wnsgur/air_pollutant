document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5d633e2a434ae27155c0f3f0c35e524c';

    // Initialize the canvas contexts for the charts
    const lineChartCtx1 = document.getElementById('lineChart1').getContext('2d');
    const lineChartCtx2 = document.getElementById('lineChart2').getContext('2d');
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');

    // Initialize the charts
    const lineChart1 = new Chart(lineChartCtx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                fill: false
            }]
        }
    });

    const lineChart2 = new Chart(lineChartCtx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                fill: false
            }]
        }
    });

    const barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: ['PM2.5', 'PM10', 'NOx', 'NH3', 'CO2', 'SO2', 'O3'],
            datasets: [{
                label: 'Pollutant Levels',
                data: [],
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown']
            }]
        }
    });

    const doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['PM2.5', 'PM10', 'NOx', 'NH3', 'CO2', 'SO2', 'O3'],
            datasets: [{
                data: [],
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown']
            }]
        }
    });

    function updateCharts(data) {
        // Update line charts
        lineChart1.data.labels = data.forecastTimes;
        lineChart2.data.labels = data.forecastTimes;

        lineChart1.data.datasets[0].data = data.temperatures;
        lineChart2.data.datasets[0].data = data.humidities;

        lineChart1.update();
        lineChart2.update();

        // Update bar and doughnut charts
        const pollutants = [data.pm25, data.pm10, data.nox, data.nh3, data.co2, data.so2, data.voc];
        barChart.data.datasets[0].data = pollutants;
        doughnutChart.data.datasets[0].data = pollutants;

        barChart.update();
        doughnutChart.update();
    }

    function fetchWeatherData(lat, lon) {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        Promise.all([
            fetch(forecastUrl).then(res => res.json()),
            fetch(airQualityUrl).then(res => res.json())
        ])
        .then(([forecastData, airQualityData]) => {
            if (forecastData && forecastData.list) {
                const now = Date.now(); // 현재 시간(밀리초)
                const oneDayLater = now + 24 * 60 * 60 * 1000; // 현재 시간으로부터 24시간 후

                const filteredForecast = forecastData.list.filter(entry => {
                    const forecastTime = entry.dt * 1000;
                    return forecastTime >= now && forecastTime <= oneDayLater;
                });

                const forecastTimes = filteredForecast.map(entry => {
                    const forecastTime = entry.dt * 1000; // 예보 시간(밀리초)
                    const diffHours = Math.round((forecastTime - now) / (1000 * 60 * 60)); // 시간 차이 계산
                    return diffHours >= 0 ? `+${diffHours}h` : `${diffHours}h`;
                });

                const temperatures = filteredForecast.map(entry => entry.main.temp);
                const humidities = filteredForecast.map(entry => entry.main.humidity);

                const airComponents = airQualityData.list[0].components;

                updateCharts({
                    forecastTimes,
                    temperatures,
                    humidities,
                    pm25: airComponents.pm2_5,
                    pm10: airComponents.pm10,
                    nox: airComponents.no2,
                    nh3: airComponents.nh3,
                    co2: airComponents.co,
                    so2: airComponents.so2,
                    voc: airComponents.o3
                });
            } else {
                console.error('Forecast data is missing or invalid:', forecastData);
            }
        })
        .catch(error => console.error('Error fetching weather or air quality data:', error));
    }

    function updateLocationFromDropdown() {
        const locationSelect = document.getElementById('location-select');
        const selectedValue = locationSelect.value;

        if (selectedValue) {
            const [lat, lon] = selectedValue.split(',').map(Number);
            fetchWeatherData(lat, lon);
        }
    }

    // Initial fetch for default location (Busan)
    fetchWeatherData(35.1796, 129.0756);

    // Add event listener for dropdown change
    document.getElementById('location-select').addEventListener('change', updateLocationFromDropdown);
});
