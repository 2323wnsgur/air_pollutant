
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5d633e2a434ae27155c0f3f0c35e524c'; // OpenWeather API 키로 바꾸세요

    // 주기적으로 데이터를 업데이트하는 함수
    function updateData() {
        // 날씨 및 대기 오염 데이터를 동시에 가져오기 위한 Promise.all
        Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=35.1796&lon=129.0756&units=metric&appid=${apiKey}`)
                .then(response => response.json())
                .catch(error => console.error('Error fetching weather data:', error)),
            
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=35.1796&lon=129.0756&appid=${apiKey}`)
                .then(response => response.json())
                .catch(error => console.error('Error fetching air pollution data:', error))
        ]).then(([weatherData, airData]) => {
            if (weatherData && airData) {
                // HTML에 날씨 데이터 업데이트
                document.getElementById('temperature').textContent = weatherData.main.temp;
                document.getElementById('humidity').textContent = weatherData.main.humidity;

                // HTML에 대기 오염 데이터 업데이트
                const airComponents = airData.list[0].components;
                document.getElementById('pm25').textContent = airComponents.pm2_5;
                document.getElementById('pm10').textContent = airComponents.pm10;
                document.getElementById('nox').textContent = airComponents.no2;
                document.getElementById('nh3').textContent = airComponents.nh3;
                document.getElementById('co2').textContent = airComponents.co;
                document.getElementById('so2').textContent = airComponents.so2;
                document.getElementById('voc').textContent = airComponents.o3;

                // 차트 업데이트 함수 호출
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

    // 5초마다 데이터 업데이트
    setInterval(updateData, 5000);

    // 차트를 초기화하는 함수
    const lineChartCtx1 = document.getElementById('lineChart1').getContext('2d');
    const lineChartCtx2 = document.getElementById('lineChart2').getContext('2d');
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');

    const lineChart1 = new Chart(lineChartCtx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false
                }
            ]
        }
    });
    const lineChart2 = new Chart(lineChartCtx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    fill: false
                }
            ]
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

    // 차트를 업데이트하는 함수
    function updateCharts(data) {
        // 시간 라벨 업데이트
        const currentTime = new Date().toLocaleTimeString();
        lineChart1.data.labels.push(currentTime);
        lineChart2.data.labels.push(currentTime);
        // 온도와 습도 데이터 업데이트
        lineChart1.data.datasets[0].data.push(data.temperature);
        lineChart2.data.datasets[0].data.push(data.humidity);
        
        // 데이터 갯수가 너무 많아지면 첫 번째 항목 제거
        if (lineChart1.data.labels.length > 20) {
            lineChart1.data.labels.shift();
            lineChart1.data.datasets[0].data.shift();
            lineChart1.data.datasets[1].data.shift();
        }
        lineChart1.update();
        if (lineChart2.data.labels.length > 20) {
            lineChart2.data.labels.shift();
            lineChart2.data.datasets[0].data.shift();
            lineChart2.data.datasets[1].data.shift();
        }
        lineChart2.update();
        // 바 및 도넛 차트 데이터 업데이트
        const pollutants = [data.pm25, data.pm10, data.nox, data.nh3, data.co2, data.so2, data.voc];
        barChart.data.datasets[0].data = pollutants;
        doughnutChart.data.datasets[0].data = pollutants;

        barChart.update();
        doughnutChart.update();
    }
});



/*


*/
