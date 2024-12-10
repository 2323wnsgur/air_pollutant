document.addEventListener('DOMContentLoaded', () => {
    const csvInput = document.getElementById('csv-upload');

    // Listen for file selection
    csvInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`File selected: ${file.name}`); // Debug: Log file name
            Papa.parse(file, {
                header: true, // Use first row as headers
                skipEmptyLines: true, // Skip empty rows
                complete: function (results) {
                    const data = results.data; // Parsed data
                    console.log('Parsed Data:', data); // Debug: Log parsed data
                    updateDashboard(data);
                },
                error: function (error) {
                    console.error('Error parsing CSV:', error);
                },
            });
        } else {
            console.error('No file selected.');
        }
    });

    // Update dashboard elements with data from CSV
    function updateDashboard(data) {
        if (data.length > 0) {
            const row = data[2]; // Use the first row of data
            console.log('Updating dashboard with:', row); // Debug: Log the row being used

            // Time, Temperature, Humidity, Weather, Wind Speed
            if (row.time) document.getElementById('time').textContent = row.time;
            if (row.temp) document.getElementById('temperature').textContent = row.temp;
            if (row.humi) document.getElementById('humidity').textContent = row.humi;
            if (row.icon) document.getElementById('weather').textContent = row.icon;
            if (row.wind) document.getElementById('windspeed').textContent = row.wind;

            // Air Quality Metrics
            if (row.pm25) document.getElementById('pm25').textContent = row.pm25;
            if (row.pm10) document.getElementById('pm10').textContent = row.pm10;
            if (row.nox) document.getElementById('nox').textContent = row.nox;
            if (row.nh3) document.getElementById('nh3').textContent = row.nh3 ;
            if (row.co) document.getElementById('co2').textContent = row.co;
            if (row.so2) document.getElementById('so2').textContent = row.so2;
            if (row.o3) document.getElementById('voc').textContent = row.o3;
        } else {
            console.error('CSV data is empty or invalid.');
        }
    }
});
