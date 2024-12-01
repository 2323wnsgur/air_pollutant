document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5d633e2a434ae27155c0f3f0c35e524c'


    const map = L.map('satellite-map').setView([35.1796, 129.0756], 3); // Default to Busan

    // Add tile layer to the map
    L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        maxZoom: 18,
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
    }).addTo(map);

    // Initialize a variable for the marker
    let marker;

    // Initialize the canvas contexts for the charts
    /*const lineChartCtx1 = document.getElementById('lineChart1').getContext('2d');
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
    });*/

    function getAirQualityColor(value, type) {
        // Define thresholds for pollutants (example: PM2.5)
        const thresholds = {
            pm25: { good: 0, moderate: 50, unhealthy: 75 },
            pm10: { good: 0, moderate: 50, unhealthy: 200 },
            nox: { good: 0, moderate: 150, unhealthy: 200 },
            nh3: { good: 0, moderate: 25, unhealthy: 75 },
            co2: { good: 0, moderate: 12400, unhealthy: 15400 },
            so2: { good: 0, moderate: 250, unhealthy: 350 },
            voc: { good: 0, moderate: 140, unhealthy: 180 }
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
        /*const currentTime = new Date().toLocaleTimeString();
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
        doughnutChart.update();*/
        document.getElementById('pm25').style.color = getAirQualityColor(data.pm25, 'pm25');
        document.getElementById('pm10').style.color = getAirQualityColor(data.pm10, 'pm10');
        document.getElementById('nox').style.color = getAirQualityColor(data.nox, 'nox');
        document.getElementById('nh3').style.color = getAirQualityColor(data.nh3, 'nh3');
        document.getElementById('co2').style.color = getAirQualityColor(data.co2, 'co2');
        document.getElementById('so2').style.color = getAirQualityColor(data.so2, 'so2');
        document.getElementById('voc').style.color = getAirQualityColor(data.voc, 'voc');
}


// 날짜 생성 (YYYYMMDD 형식)    
function updateData(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(weatherData => {
            if (weatherData) {
                // Update weather information
                document.getElementById('temperature').textContent = weatherData.main.temp;
                document.getElementById('humidity').textContent = weatherData.main.humidity;
                document.getElementById('weather').textContent = weatherData.weather[0].description;
                document.getElementById('windspeed').textContent = weatherData.wind.speed;

                // Update weather icon
                const iconCode = weatherData.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                const weatherImage = document.getElementById('weather-image');
                weatherImage.src = iconUrl;
                weatherImage.style.display = "block";

                // Update local time for the location
                const timezoneOffset = weatherData.timezone; // Timezone offset in seconds
                updateLocalTime(timezoneOffset);

                // Fetch and update air quality data
                fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(airData => {
                        if (airData) {
                            const airComponents = airData.list[0].components;
                            document.getElementById('pm25').textContent = airComponents.pm2_5;
                            document.getElementById('pm10').textContent = airComponents.pm10;
                            document.getElementById('nox').textContent = airComponents.no2;
                            document.getElementById('nh3').textContent = airComponents.nh3;
                            document.getElementById('co2').textContent = airComponents.co;
                            document.getElementById('so2').textContent = airComponents.so2;
                            document.getElementById('voc').textContent = airComponents.o3;
                        }
                    })
                    .catch(error => console.error('Error fetching air pollution data:', error));
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to update local time
function updateLocalTime(offsetInSeconds) {
    const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000; // Current UTC time in milliseconds
    const localTime = new Date(nowUTC + offsetInSeconds * 1000); // Apply timezone offset
    const timeElement = document.getElementById('time');
    timeElement.textContent = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to handle location updates from dropdown
function updateLocationFromDropdown() {
    const selectedValue = document.getElementById('location-select').value;
    if (selectedValue) {
        const [lat, lon] = selectedValue.split(',').map(coord => parseFloat(coord));

        // Update map view to new location
        map.setView([lat, lon], 10);

        // Update marker position
        if (marker) {
            map.removeLayer(marker); // Remove existing marker
        }
        marker = L.marker([lat, lon]).addTo(map).bindPopup(`Location Updated`).openPopup();

        // Update weather and air quality data
        updateData(lat, lon);
    }
}

// Initial data update (default location: Busan)
updateData(35.1796, 129.0756);

// Expose function globally for use in the HTML
window.updateLocationFromDropdown = updateLocationFromDropdown;
/*
const weatherImages = {
    "clear sky": "images/clear_sky.png",
    "few clouds": "images/few_clouds.png",
    "scattered clouds": "images/scattered_clouds.png",
    "broken clouds": "images/broken_clouds.png",
    "shower rain": "images/shower_rain.png",
    "rain": "images/rain.png",
    "thunderstorm": "images/thunderstorm.png",
    "snow": "images/snow.png",
    "mist": "images/mist.png",
};    
function updateWeatherImage(description) {
    const imageElement = document.getElementById('weather-image');
    const imageSrc = weatherImages[description] || "images/default.png"; // 매칭되지 않으면 기본 이미지 사용
    
    // 이미지 업데이트
    imageElement.src = imageSrc;
    imageElement.style.display = "block"; // 이미지를 표시
}



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
            const description = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon; // 아이콘 코드 가져오기
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // 아이콘 URL 생성

            document.getElementById('temperature').textContent = weatherData.main.temp;
            document.getElementById('humidity').textContent = weatherData.main.humidity;
            document.getElementById('weather').textContent = description;
            document.getElementById('windspeed').textContent = weatherData.wind.speed;

            // 이미지 업데이트
            const imageElement = document.getElementById('weather-image');
            imageElement.src = iconUrl;
            imageElement.style.display = "block";

            const airComponents = airData.list[0].components;
            document.getElementById('pm25').textContent = airComponents.pm2_5;
            document.getElementById('pm10').textContent = airComponents.pm10;
            document.getElementById('nox').textContent = airComponents.no2;
            document.getElementById('nh3').textContent = airComponents.nh3;
            document.getElementById('co2').textContent = airComponents.co;
            document.getElementById('so2').textContent = airComponents.so2;
            document.getElementById('voc').textContent = airComponents.o3;

            updateCharts({
                windspeed: weatherData.wind.speed,
                weather: description,
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

function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('time');

    // 날짜와 시간 형식 지정
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // "HH:MM" 형
    timeElement.textContent = time;
}





    // Event listener for the toggle button


    // Close sidebar when clicking outside


    
    // Update data every 10 seconds
    setInterval(updateData, 10000);
    setInterval(updateDateTime, 1000);
    updateDateTime(); */
});




/*


*/
