import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false); 
  const apiKey = "31ea064be1b494428d44e68083399fa0";

  const iconMap = {
    "01d": "clear.png",
    "01n": "clear.png",
    "02d": "clouds.png",
    "02n": "clouds.png",
    "03d": "clouds.png",
    "03n": "clouds.png",
    "04d": "clouds.png",
    "04n": "clouds.png",
    "09d": "rain.png",
    "09n": "rain.png",
    "10d": "rain.png",
    "10n": "rain.png",
    "11d": "storm.png",
    "11n": "storm.png",
    "13d": "snow.png",
    "13n": "snow.png",
    "50d": "fog.png",
    "50n": "fog.png",
  };

  const getWeather = async () => {
    setLoading(true);

    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`
      );
      setCurrentWeather(currentRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`
      );

      const filtered = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(filtered.slice(0, 6));
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("City not found or API error");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">🌤️ Weather Forecast</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary" onClick={getWeather}>
          Search
        </button>
      </div>

      {/* Show loading spinner or message */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading...</p>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {/* Current Weather Card */}
        {currentWeather && !loading && (
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{currentWeather.name}</h5>
                <img
                  src={`/weather-icons/${iconMap[currentWeather.weather[0].icon]}`}
                  alt="weather icon"
                  className="mb-3 floating-icon"
                />

                <p className="card-text">
                  <strong>Temperature:</strong> {currentWeather.main.temp}°C
                </p>
                <p className="card-text text-capitalize">
                  <strong>Condition:</strong> {currentWeather.weather[0].description}
                </p>
                <p className="card-text">
                  <strong>Humidity:</strong> {currentWeather.main.humidity}% <i class="fa-solid fa-water"></i>
                </p>
                <p className="card-text">
                  <strong>Wind Speed:</strong> {currentWeather.wind.speed} m/s <i class="fa-solid fa-wind"></i>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Cards */}
        {forecast.length > 0 && !loading &&
          forecast.map((day, index) => (
            <div className="col" key={index}>
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title">{new Date(day.dt_txt).toLocaleDateString()}</h5>
                  <div className="">
                    <img
                      src={`/weather-icons/${iconMap[day.weather[0].icon]}`}
                      alt="icon"
                      className="mb-3 floating-icon"
                    />
                  </div>
                  <p className="card-text">
                    <strong><i class="fa-solid fa-temperature-three-quarters"></i> {day.main.temp}°C</strong>
                  </p>
                  <p>
                    <strong>Conditions: </strong>{day.weather[0].description}</p>
                  <p className="card-text">
                    <strong>Humidity:</strong> {day.main.humidity}% <i class="fa-solid fa-water"></i>
                  </p>
                  <p className="card-text">
                    <strong>Wind Speed:</strong> {day.wind.speed} m/s <i class="fa-solid fa-wind"></i>
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeatherApp;
