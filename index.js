document.addEventListener("DOMContentLoaded", function () {
    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();

    // Open-Meteo API 
    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log API response 

            // Temp and weather description
            const temperature = data.current_weather.temperature;
            const weatherDescription = data.current_weather.weathercode; // Weather codes from Open-Meteo

            // Display weather data
            const weatherDataElement = document.getElementById("weatherData");
            weatherDataElement.textContent = `Current Temperature: ${temperature}°C, Weather Code: ${weatherDescription}`;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("weatherData").textContent = "Failed to load weather data. Please try again later.";
        });
});
