import React, { useState, useEffect, useCallback } from 'react';
import './SkyApp.css';
import Clock from './Clock';
import LocationTime from './LocationTime';

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import clearn_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import cloudn_icon from '../Assets/cloudn.png';
import drizzle_icon from '../Assets/drizzle.png';
import drizzlen_icon from '../Assets/drizzlen.png';
import rain_icon from '../Assets/rain.png';
import rainn_icon from '../Assets/rainn.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import mist_icon from '../Assets/mist.png';
import mistn_icon from '../Assets/mistn.png';
import humidity_icon from '../Assets/humidity.png';
import pressure_icon from '../Assets/pressure.png';
import temperature_icon from '../Assets/temperature.png';
import sunrise_icon from '../Assets/sunrise.png';
import sunset_icon from '../Assets/sunset.png';
import thunderstorm_icon from '../Assets/thunderstorm.png';
import clock_icon from '../Assets/clock.png';

const SkyApp = () => {
    let api_key = "YOUR_API_KEY";
    const [weatherIcon, setWeatherIcon] = useState('');
    const [humidity, setHumidity] = useState('');
    const [wind, setWind] = useState('');
    const [temperature, setTemperature] = useState('');
    const [weather, setWeather] = useState('');
    const [feelsLike, setFeelsLike] = useState('');
    const [sunRise, setSunRise] = useState('');
    const [sunSet, setSunSet] = useState('');
    const [pressure, setPressure] = useState('');
    const [locationTimezoneOffset, setLocationTimezoneOffset] = useState('');
    const [location, setLocation] = useState('Philadelphia'); // Default location

    const adjustTimezone = (timestamp, offset) => {
        // timestamp and offset in seconds, convert offset to milliseconds
        const date = new Date(timestamp * 1000);
        const localTime = date.getTime();
        const localOffset = date.getTimezoneOffset() * 60000; // Convert local timezone offset to milliseconds
        const utc = localTime + localOffset; // UTC time
        const locationTime = utc + (offset * 1000); // Convert offset to milliseconds and adjust
        return new Date(locationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const fetchWeatherData = useCallback(async (input) => {

        if (/\d/.test(input)) {
            alert("City not found. Please enter a valid city name.");
            return;
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=${api_key}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod.toString() !== "200") {
                alert("City not found. Please enter a valid city name.");
                return;
            }

            // Update state with the fetched data
            setHumidity(data.main.humidity + " %");
            setWind(Math.floor(data.wind.speed) + " km/h");
            setTemperature(Math.floor(data.main.temp) + "°F");
            setWeather(data.weather[0].main);
            setLocation(data.name);
            setFeelsLike(Math.floor(data.main.feels_like) + "°F");
            setSunRise(adjustTimezone(data.sys.sunrise, data.timezone));
            setSunSet(adjustTimezone(data.sys.sunset, data.timezone));
            setPressure(data.main.pressure + " hPa");
            setLocationTimezoneOffset(data.timezone);
            
            const weatherCode = data.weather[0].icon;
            const getWeatherIcon = (weatherCode) => {
                switch (true) {
                    case weatherCode === '01d': return clear_icon;
                    case weatherCode === '01n': return clearn_icon;
                    case weatherCode === '02d':
                    case weatherCode === '03d':
                    case weatherCode === '04d': return cloud_icon;
                    case weatherCode === '02n':
                    case weatherCode === '03n':
                    case weatherCode === '04n': return cloudn_icon;
                    case weatherCode === '09d': return drizzle_icon;
                    case weatherCode === '09n': return drizzlen_icon;
                    case weatherCode === '10d': return rain_icon;
                    case weatherCode === '10n': return rainn_icon; // This ensures 10n is correctly identified
                    case weatherCode.startsWith('11'): return thunderstorm_icon;
                    case weatherCode.startsWith('13'): return snow_icon;
                    case weatherCode === '50d': return mist_icon;
                    case weatherCode === '50n': return mistn_icon;
                    default: return cloud_icon; // Default fallback to cloud_icon
                }
            };
            
            const selectedIcon = getWeatherIcon(weatherCode);
            setWeatherIcon(selectedIcon);

        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }, [api_key]);

    // Fetch Philadelphia weather data on component mount
    useEffect(() => {
        fetchWeatherData(location);
    }, [fetchWeatherData, location]);

    return (
        <div className='container'>
            <div className="top-bar">
                <input type="text" className="cityInput" placeholder='Search any City'/>
                <div className="search-icon" onClick={() => fetchWeatherData(document.getElementsByClassName("cityInput")[0].value)}>
                    <img src={search_icon} alt="Search" />

                </div>
            </div>
            <div className="weather-image">
                <img src={weatherIcon} alt="Weather Icon" />
                
            </div>
            <div className="weather">{weather}</div>            
            <div className="weather-temp">{temperature}</div>
            <div className="weather-location">{location}</div>
            <div className="data-container">
            <div className="element">
            <img src={temperature_icon} alt="Temperature Icon" />
            <div className="data">{feelsLike}</div>
            <div className="text">Feels Like</div>
             </div>
                <div className="element">
                    <img src={sunrise_icon} alt="Sunrise Icon" />
                    <div className="data">{sunRise}</div>
                    <div className="text">Sunrise</div>
                </div>
                <div className="element">
                    <img src={sunset_icon} alt="Sunset Icon" />
                    <div className="data">{sunSet}</div>
                    <div className="text">Sunset</div>
                </div>
                <div className="element">
                    <img src={pressure_icon} alt="Pressure Icon" />
                    <div className="data">{pressure}</div>
                    <div className="text">Pressure</div>
                </div>
                <div className="element">
                    <img src={humidity_icon} alt="Humidity Icon" />
                    <div className="data">{humidity}</div>
                    <div className="text">Humidity</div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="Wind Icon" />
                    <div className="data">{wind}</div>
                    <div className="text">Wind Speed</div>
                </div>
                <div className="element">
                    <img src={clock_icon} alt="Clock Icon" />
                    <div className="data">{<LocationTime timezoneOffset={locationTimezoneOffset} />}</div>
                    <div className="text">Current Time</div>
                </div>
            </div>
            <Clock/>
            </div>
    );
}

export default SkyApp;
