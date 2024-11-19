document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5d633e2a434ae27155c0f3f0c35e524c'

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
            labels: ['PM2.5', 'PM10', 'NOx', 'NH3', 'CO2', 'SO2', 'VOC'],
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
            labels: ['PM2.5', 'PM10', 'NOx', 'NH3', 'CO2', 'SO2', 'VOC'],
            datasets: [{
                data: [],
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown']
            }]
        }
    });

    function getAirQualityColor(value, type) {
        // Define thresholds for pollutants (example: PM2.5)
        const thresholds = {
            pm25: { good: 0, moderate: 50, unhealthy: 100 },
            pm10: { good: 0, moderate: 50, unhealthy: 150 },
            nox: { good: 0, moderate: 100, unhealthy: 200 },
            nh3: { good: 0, moderate: 25, unhealthy: 75 },
            co2: { good: 0, moderate: 400, unhealthy: 1000 },
            so2: { good: 0, moderate: 50, unhealthy: 100 },
            voc: { good: 0, moderate: 100, unhealthy: 200 }
        };

        let color = 'green'; // Default to good air quality (green)
        if (value > thresholds[type].unhealthy) {
            color = 'red'; // Unhealthy
        } else if (value > thresholds[type].moderate) {
            color = 'yellow'; // Moderate
        }

        return color;
    }

    // Function to update the charts with new data
    function updateCharts(data) {
        const currentTime = new Date().toLocaleTimeString();
        lineChart1.data.labels.push(currentTime);
        lineChart2.data.labels.push(currentTime);

        lineChart1.data.datasets[0].data.push(data.temperature);
        lineChart2.data.datasets[0].data.push(data.humidity);

        if (lineChart1.data.labels.length > 20) {
            lineChart1.data.labels.shift();
            lineChart1.data.datasets[0].data.shift();
        }
        lineChart1.update();

        if (lineChart2.data.labels.length > 20) {
            lineChart2.data.labels.shift();
            lineChart2.data.datasets[0].data.shift();
        }
        lineChart2.update();

        const pollutants = [data.pm25, data.pm10, data.nox, data.nh3, data.co2, data.so2, data.voc];
        barChart.data.datasets[0].data = pollutants;
        doughnutChart.data.datasets[0].data = pollutants;
        
        barChart.data.datasets[0].backgroundColor = pollutants.map((value, index) => {
            const types = ['pm25', 'pm10', 'nox', 'nh3', 'co2', 'so2', 'voc'];
            return getAirQualityColor(value, types[index]);
        });
        barChart.update();
        doughnutChart.update();

        document.getElementById('pm25').style.color = getAirQualityColor(data.pm25, 'pm25');
        document.getElementById('pm10').style.color = getAirQualityColor(data.pm10, 'pm10');
        document.getElementById('nox').style.color = getAirQualityColor(data.nox, 'nox');
        document.getElementById('nh3').style.color = getAirQualityColor(data.nh3, 'nh3');
        document.getElementById('co2').style.color = getAirQualityColor(data.co2, 'co2');
        document.getElementById('so2').style.color = getAirQualityColor(data.so2, 'so2');
        document.getElementById('voc').style.color = getAirQualityColor(data.voc, 'voc');
    }

    // Function to fetch and update data
    function updateData() {
        Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=35.1796&lon=129.0756&units=metric&appid=${apiKey}`)
                .then(response => response.json())
                .catch(error => console.error('Error fetching weather data:', error)),
            
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=35.1796&lon=129.0756&appid=${apiKey}`)
                .then(response => response.json())
                .catch(error => console.error('Error fetching air pollution data:', error))
        ]).then(([weatherData, airData]) => {
            if (weatherData && airData) {
                document.getElementById('temperature').textContent = weatherData.main.temp;
                document.getElementById('humidity').textContent = weatherData.main.humidity;

                const airComponents = airData.list[0].components;
                document.getElementById('pm25').textContent = airComponents.pm2_5;
                document.getElementById('pm10').textContent = airComponents.pm10;
                document.getElementById('nox').textContent = airComponents.no2;
                document.getElementById('nh3').textContent = airComponents.nh3;
                document.getElementById('co2').textContent = airComponents.co;
                document.getElementById('so2').textContent = airComponents.so2;
                document.getElementById('voc').textContent = airComponents.o3;

                // Pass the fetched data to update the charts
                updateCharts({
                    temperature: weatherData.main.temp,
                    humidity: weatherData.main.humidity,
                    pm25: airComponents.pm2_5,
                    pm10: airComponents.pm10,
                    nox: airComponents.no2,
                    nh3: airComponents.nh3,
                    co2: airComponents.co,
                    so2: airComponents.so2,
                    voc: airComponents.o3
                });
            }
        });
    }

    // Update data every 10 seconds
    setInterval(updateData, 10000);
});

/*


*/
