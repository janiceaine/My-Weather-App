import { useEffect, useState, useCallback } from "react";
// import Lottie from "lottie-react";
import { ClipLoader } from "react-spinners";
import "./WeatherApp.css";

export const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("Dallas");
    const [loading, setLoading] = useState(false);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const getWeatherAnimation = (weatherType) => {
        const gifs = {
            Clear: "/assets/animations/sunny.gif",
            Clouds: "/assets/animations/cloudy.gif",
            Rain: "/assets/animations/rainy.gif",
            Snow: "/assets/animations/snowy.gif",
            Thunderstorm: "/assets/animations/thunderstorm.gif"
        };
        return gifs[weatherType] || "/assets/animations/default.gif"; // Fallback if unknown type
    };

    const searchWeather = useCallback(async () => {
        setLoading(true);
        setAnimationLoaded(false);
        try {
            const APIKEY = import.meta.env.VITE_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKEY}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`City not found: ${city}`);

            const data = await res.json();
            setWeatherData(data);
            setTimeout(() => {
                setAnimationLoaded(true);
                setIsVisible(true);
            }, 300);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [city]);

    useEffect(() => {
        searchWeather();
    }, [searchWeather]);

    return (
        <div className="container">
            <div className="weather-app">
                <div className="search">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <i className="fa-solid fa-magnifying-glass" onClick={searchWeather}></i>
                    </div>
                </div>

                {loading ? (
                    <div className="spinner">
                        <ClipLoader color="white" size={50} />
                    </div>
                ) : (
                    weatherData &&
                    animationLoaded && (
                        <div className={`lottie-container ${isVisible ? "visible" : ""}`}>
                            <img src={getWeatherAnimation(weatherData.weather[0].main)} alt="weather animation" style={{ height: 150 }} />
                            <div className="weather-type">{weatherData.weather[0].main}</div>
                            <div className="temp">{Math.round(weatherData.main.temp)}°F</div>
                        </div>
                    )
                )}

                {weatherData && !loading && (
                    <div className="weather-details">
                        <div className="detail-box">
                            <div className="data-name">Humidity</div>
                            <i className="fa-solid fa-droplet"></i>
                            <div className="data">{weatherData.main.humidity}%</div>
                        </div>
                        <div className="detail-box">
                            <div className="data-name">Wind</div>
                            <i className="fa-solid fa-wind"></i>
                            <div className="data">{weatherData.wind.speed} mph</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
