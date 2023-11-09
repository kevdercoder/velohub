import {
  supa
} from "/js/supabase.js";

/*
 * This script fetches the current weather data from the OpenWeatherMap API.
 * It then displays the current temperature and weather image.
 */

let API_KEY = 'fcc3f6d978376e674cc87cad43d09e19';
let CITY = 'Bern';
let COUNTRY_CODE = 'CH';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    let currentTemp = Math.round(data.main.temp - 273.15);

    if (document.querySelector('#temp')) {
      document.querySelector('#temp').innerHTML = currentTemp;
    }

    // Get the current weather condition and icon
    let weatherCondition = data.weather[0].main;

    // Determine the daytime based on the current time and timezone offset
    let timezoneOffset = data.timezone;
    let currentTime = new Date();
    let localTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000) + (timezoneOffset * 1000);
    let localDate = new Date(localTime);
    let hours = localDate.getHours();
    let isDaytime = hours >= 6 && hours < 18;

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

    if (document.querySelector('#weather-icon')) {
      document.querySelector('#weather-icon').src = iconUrl;
    }



    let temperaturesToCheck = [10, 15, 20, 25]; 
    let isRaining = weatherCondition === 'Rain';

    console.log(isRaining)

    let closestTemperature = temperaturesToCheck[0]; // Initialize with the first temperature
    console.log(closestTemperature)
    for (let temperature of temperaturesToCheck) {
      if (Math.abs(currentTemp - temperature) < Math.abs(currentTemp - closestTemperature)) {
        closestTemperature = temperature;
      }
    }

    supa
      .from('clothes')
      .select('*')
      .eq('temperature', closestTemperature)
      .eq('rain', isRaining)
      .then(({
        data,
        error
      }) => {
        if (error) {
          console.error('Error selecting row:', error);
        } else {
          if (data.length > 0) {
            let selectedRow = data[0];
            console.log(`Selected row for closest temperature ${closestTemperature} and rain ${isRaining}:`, selectedRow);
          } else {
            console.log(`No matching rows found for temperature ${closestTemperature}.`);
          }
        }

        let selectedRow = data[0];

        for (let key in selectedRow) {
          let value = selectedRow[key];
          if (typeof value === 'string' && value !== true && value !== false && value !== null) {
            let clothingImage = document.createElement('img');
            let createContainer = document.createElement('div')
            createContainer.className = "clothes"
            clothingImage.src = `https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public${value}`;
            clothingImage.alt = `${key} Image`;
            createContainer.appendChild(clothingImage);
            document.getElementById('container-clothes').appendChild(createContainer);
          }
        }

        // Hide skeleton-loading after maps are loaded
        let skeletonLoading = document.querySelectorAll('.skeleton-loading');

        skeletonLoading.forEach(loadingBox => {
          loadingBox.style.display = 'none';
        });
       


      });



  })

  .catch(error => {
    console.log(error);
  });