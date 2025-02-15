// Weather code mapping--desc and icons
const weatherIcons = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Depositing Rime Fog", icon: "🌫️" },
    51: { text: "Drizzle (Light)", icon: "🌦️" },
    53: { text: "Drizzle (Moderate)", icon: "🌦️" },
    55: { text: "Drizzle (Dense)", icon: "🌧️" },
    61: { text: "Rain (Light)", icon: "🌦️" },
    63: { text: "Rain (Moderate)", icon: "🌧️" },
    65: { text: "Rain (Heavy)", icon: "🌧️" },
    71: { text: "Snow (Light)", icon: "❄️" },
    73: { text: "Snow (Moderate)", icon: "❄️" },
    75: { text: "Snow (Heavy)", icon: "❄️" },
    80: { text: "Rain Showers (Light)", icon: "🌦️" },
    81: { text: "Rain Showers (Moderate)", icon: "🌧️" },
    82: { text: "Rain Showers (Violent)", icon: "⛈️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
    96: { text: "Thunderstorm (Hail)", icon: "⛈️" },
    99: { text: "Thunderstorm (Heavy Hail)", icon: "⛈️" }
};

// Tab Switching 
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
    document.body.classList.add("tab-weather"); // Set default background
});

function openTab(tabName) {
    let tabs = document.querySelectorAll(".tab-content");
    let buttons = document.querySelectorAll(".tab-button");

    tabs.forEach(tab => tab.classList.remove("active"));
    buttons.forEach(button => button.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    document.querySelector(`[onclick="openTab('${tabName}')"]`).classList.add("active");

    // Change background based on active tab
    document.body.classList.remove("tab-weather", "tab-history");
    if (tabName === "current-weather") {
        document.body.classList.add("tab-weather");
    } else if (tabName === "historical-weather") {
        document.body.classList.add("tab-history");
    }
}

// Get coordinates for zip
function getCoordinates(zip) {
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1&format=json`)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                throw new Error("Invalid Zip Code. Please enter a valid US ZIP code.");
            }
            console.log("Open-Meteo API Response:", data); // Debugging Log
            return {
                latitude: data.results[0].latitude,
                longitude: data.results[0].longitude
            };
        })
        .catch(error => {
            console.error("Geocoding Error:", error);
            alert(error.message);
        });
}

// Fetch current US weather
function getCurrentUSWeather() {
    const zip = document.getElementById("us-zip").value;
    getCoordinates(zip)
        .then(({ latitude, longitude }) => {
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit`);
        })
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;
            const condition = weatherIcons[weather.weathercode] || { text: "Unknown", icon: "❓" };
            const maxTemp = data.daily.temperature_2m_max[0]; // High temp
            const minTemp = data.daily.temperature_2m_min[0]; // Low temp
            document.getElementById("us-weather-result").innerHTML = `
                <p>Current Temperature: ${weather.temperature}°F</p>
                <p>High: ${maxTemp}°F | Low: ${minTemp}°F</p>
                <p>Condition: ${condition.icon} ${condition.text}</p>
            `;
        })
        .catch(error => alert(error.message));
}

// Fetch historical US weather
function getHistoricalUSWeather() {
    const zip = document.getElementById("history-zip").value;
    const date = document.getElementById("history-date").value;
    getCoordinates(zip)
        .then(({ latitude, longitude }) => {
            return fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit`);
        })
        .then(response => response.json())
        .then(data => {
            if (!data.daily) throw new Error("No data available for this date.");
            const maxTemp = data.daily.temperature_2m_max[0];
            const minTemp = data.daily.temperature_2m_min[0];
            const weatherCode = data.daily.weathercode[0]; // Weather condition
            const condition = weatherIcons[weatherCode] || { text: "Unknown", icon: "❓" };
            document.getElementById("history-weather-result").innerHTML = `
                <p>High Temperature: ${maxTemp}°F</p>
                <p>Low Temperature: ${minTemp}°F</p>
                <p>Condition: ${condition.icon} ${condition.text}</p>
            `;
        })
        .catch(error => alert(error.message));
}

// Event Listeners 
document.getElementById("us-weather-btn").addEventListener("click", getCurrentUSWeather);
document.getElementById("history-weather-btn").addEventListener("click", getHistoricalUSWeather);
