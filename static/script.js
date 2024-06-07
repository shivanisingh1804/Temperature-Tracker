document.getElementById('getWeather').addEventListener('click', function() {
    var city = document.getElementById('city').value;
    if (city) {
        fetch(`/weather/${city}`)
            .then(response => response.json())
            .then(data => {
                var resultDiv = document.getElementById('weatherResult');
                resultDiv.innerHTML = `<h2>Weather in ${data.name}</h2>
                                       <p>Temperature: ${data.celsius.toFixed(2)}°C</p>`;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                var resultDiv = document.getElementById('weatherResult');
                resultDiv.innerHTML = `<p style="color: red;">Error fetching weather data. Please try again.</p>`;
            });
    } else {
        alert('Please enter a city name.');
    }
});
