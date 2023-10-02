const API_KEY = 'fcc3f6d978376e674cc87cad43d09e19';
const CITY = 'Zurich';
const COUNTRY_CODE = 'CH';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    currentTemp = Math.round(data.main.temp - 273.15);
    document.querySelector('#temp').innerHTML = currentTemp;
  })
  .catch(error => {
    console.log(error);
  });