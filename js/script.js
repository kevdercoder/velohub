/*
 * This script fetches the current weather data from the OpenWeatherMap API.
 * It then displays the current temperature and weather image.
*/

const API_KEY = 'fcc3f6d978376e674cc87cad43d09e19';
const CITY = 'Bern';
const COUNTRY_CODE = 'CH';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    let currentTemp = Math.round(data.main.temp - 273.15);
    document.querySelector('#temp').innerHTML = currentTemp;


    // Get the current weather condition and icon
    const weatherCondition = data.weather[0].main;

    // Determine the daytime based on the current time and timezone offset
    const timezoneOffset = data.timezone;
    const currentTime = new Date();
    const localTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000) + (timezoneOffset * 1000);
    const localDate = new Date(localTime);
    const hours = localDate.getHours();
    const isDaytime = hours >= 6 && hours < 18;

    console.log(weatherCondition);

    // Set the weather icon based on the weather condition and daytime
    let iconUrl;
    if (weatherCondition === 'Clear') {
      iconUrl = isDaytime ? 'img/sun.png' : 'img/moon.svg';
    } else if (weatherCondition === 'Clouds') {
      iconUrl = isDaytime ? 'img/clouds-day.png' : 'img/clouds-night.svg';
    } else if (weatherCondition === 'Rain') {
      iconUrl = isDaytime ? 'img/rain-day.svg' : 'img/rain-night.svg';
    } else {
      iconUrl = 'img/default.png';
    }
    document.querySelector('#weather-icon').src = iconUrl;

  })
  .catch(error => {
    console.log(error);
  });

/*
 * This script fetches the current weather data from the OpenWeatherMap API.
 * It then displays the current temperature and weather image.
*/

import { supa } from "/js/supabase-setup.js";

async function selectUser() {
    const { data, error } = await supa.from("User").select()
  
    return data;
  }

console.log('User: ', selectUser());

